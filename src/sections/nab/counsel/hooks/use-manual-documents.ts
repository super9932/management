import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { deleteManual, getManualList } from '../../../../api/nab/counsel-backoffice';
import type {
  AdminTypeCode,
  ManualItem,
  ManualListRequest,
  ManualSortBy,
  SortDirection,
} from '../../../../api/nab/counsel-backoffice';
import {
  DOCUMENT_DETAIL_TOASTS,
  MANUAL_CLASS_LABEL,
  MANUAL_STATUS_CODE,
  MANUAL_STATUS_LABEL,
  PAGE_SIZE,
  manualClassCode,
  defaultSearchPeriod,
} from '../constant';
import type { UnderwritingManualRow } from '../type';
import { useAuthContext } from 'src/auth/hooks';

/**
 * 매뉴얼문서 목록 조회 (POST /v1/get/counsel/admin/manual/list).
 *
 * 언더라이팅 문서·보험심사 문서·보험공통 문서가 같은 API를 쓰고
 * 관리주체(nabCuslAdmrTypeCode)로만 갈린다 — UDW / ISRN_ADT / ISRN_SVC.
 */

/** 조회 버튼을 눌러야 실제 요청에 반영되는 값들 */
interface AppliedFilter {
  fromDate: string;
  toDate: string;
  /** 분류 표기('전체'면 조건 미적용) */
  classFilter: string;
  operationFilter: string;
  keyword: string;
}

/** 정렬 조건 — 표 헤더 화살표로 바꾼다. 서버 기본값과 같은 '번호 내림차순'에서 시작한다 */
interface AppliedSort {
  sortBy: ManualSortBy;
  sortDir: SortDirection;
}

const DEFAULT_SORT: AppliedSort = { sortBy: 'nabCuslManlDcmtId', sortDir: 'DESC' };

const DEFAULT_FILTER: AppliedFilter = {
  ...defaultSearchPeriod(),
  classFilter: '전체',
  operationFilter: '전체',
  keyword: '',
};

/** 화면 표기(YYYY.MM.DD) → API 형식(yyyy-MM-dd). 형식이 안 맞으면 조건을 걸지 않는다 */
const toApiDate = (value: string): string | undefined => {
  const date = value.trim().replace(/\./g, '-').replace(/-$/, '');

  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined;
};

/** API 일시(yyyy-MM-dd HH:mm:ss) → 화면 표기(YYYY.MM.DD). 값이 없으면 '-' */
const toDisplayDate = (value: string | null): string =>
  value ? value.trim().split(' ')[0].replace(/-/g, '.') : '-';

/** 반영/종료일자 컬럼은 시각까지 보여준다. 종료가 없으면 무기한이라 '-' */
const toDisplayDateTime = (value: string | null): string =>
  value ? value.trim().replace(/-/g, '.') : '-';

const toListRequest = (
  adminType: AdminTypeCode,
  filter: AppliedFilter,
  sort: AppliedSort,
  page: number,
  size: number,
): ManualListRequest => ({
  nabCuslAdmrTypeCode: adminType,
  rgstDttmFrom: toApiDate(filter.fromDate),
  rgstDttmTo: toApiDate(filter.toDate),
  // '전체'면 undefined 라 조건이 빠진다
  manlClsfCode: manualClassCode(adminType, filter.classFilter),
  status: MANUAL_STATUS_CODE[filter.operationFilter],
  keyword: filter.keyword.trim() || undefined,
  sortBy: sort.sortBy,
  sortDir: sort.sortDir,
  page,
  size,
});

/**
 * 목록 API 항목을 화면 행으로 옮긴다.
 *
 * 반환 타입에 category가 있어 언더라이팅 문서 표에 그대로 쓰고,
 * 보험심사·보험공통 표에는 category 없는 타입으로 전달돼도 문제 없다.
 */
const toManualRow = (item: ManualItem): UnderwritingManualRow => ({
  id: item.nabCuslManlDcmtId,
  no: item.nabCuslManlDcmtId,
  // 분류 도입 이전 등록분은 manlClsfCode 가 null 로 내려온다
  category: item.manlClsfCode ? MANUAL_CLASS_LABEL[item.manlClsfCode] : '-',
  documentName: item.manlNm,
  registrantName: item.rgsrNm,
  registrantDept: item.rgstOrgnNm,
  registeredAt: toDisplayDate(item.rgstDttm),
  effectiveStart: toDisplayDateTime(item.valdStarDttm),
  effectiveEnd: toDisplayDateTime(item.valdEndDttm),
  operationStatus: MANUAL_STATUS_LABEL[item.status],
});

const fetchManuals = async (
  adminType: AdminTypeCode,
  filter: AppliedFilter,
  sort: AppliedSort,
  page: number,
  size: number,
) => {
  const response = await getManualList(toListRequest(adminType, filter, sort, page, size));

  if (response.error) {
    throw new Error(response.error.message ?? '문서 목록 조회에 실패했습니다.');
  }

  return {
    rows: (response.data?.manlDocList ?? []).map(toManualRow),
    // 페이징 정보는 본문이 아니라 공통 엔벨로프의 page 필드에 담긴다
    totalElements: response.page?.totalElements ?? 0,
    totalPages: response.page?.totalPages ?? 0,
  };
};

/** 세 화면이 공유하는 목록 조회 상태 — 필터 입력값·조회 조건·페이지·선택을 함께 관리한다 */
export function useManualDocuments(adminType: AdminTypeCode) {
  const [fromDate, setFromDate] = useState(DEFAULT_FILTER.fromDate);
  const [toDate, setToDate] = useState(DEFAULT_FILTER.toDate);
  const [classFilter, setClassFilter] = useState(DEFAULT_FILTER.classFilter);
  const [operationFilter, setOperationFilter] = useState(DEFAULT_FILTER.operationFilter);
  const [searchType, setSearchType] = useState('문서명');
  const [searchText, setSearchText] = useState(DEFAULT_FILTER.keyword);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE);
  const [sort, setSort] = useState<AppliedSort>(DEFAULT_SORT);
  const [appliedFilter, setAppliedFilter] = useState<AppliedFilter>(DEFAULT_FILTER);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const { data, isFetching, isError, error, refetch } = useQuery(
    ['nab', 'counsel-backoffice', 'manual-list', adminType, appliedFilter, sort, page, pageSize],
    () => fetchManuals(adminType, appliedFilter, sort, page, pageSize),
    { keepPreviousData: true },
  );

  const rows = data?.rows ?? [];

  // 쓰기 API 는 작업자 사번을 요청 본문 emnb 필드로 받는다
  const { user } = useAuthContext();
  const effectiveUser = user;
  const emnb = effectiveUser?.emnb ?? '';

  const queryClient = useQueryClient();

  /** 선택 삭제 — 체크한 문서를 한 번에 소프트삭제한다 */
  const deleteMutation = useMutation(
    async (ids: number[]) => {
      const response = await deleteManual({ nabCuslManlDcmtIdList: ids }, emnb);

      if (response.error) {
        throw new Error(response.error.message ?? DOCUMENT_DETAIL_TOASTS.deleteFail);
      }

      // 색인 삭제에 실패한 문서는 목록에 그대로 남는다 — 몇 건이 실패했는지 알린다
      const failed = response.data?.failedList ?? [];
      if (failed.length > 0) {
        throw new Error(`${failed.length}건 삭제에 실패했습니다.`);
      }
    },
    {
      onSuccess: () => {
        setSelectedIds(new Set());
        queryClient.invalidateQueries(['nab', 'counsel-backoffice', 'manual-list']);
      },
      onSettled: () => {
        // 일부만 지워졌을 수 있어 실패해도 목록을 다시 읽는다
        queryClient.invalidateQueries(['nab', 'counsel-backoffice', 'manual-list']);
      },
    },
  );

  /** 조회 — 현재 입력값을 조회 조건으로 확정하고 첫 페이지부터 다시 읽는다 */
  const handleSearch = () => {
    setPage(1);
    setSelectedIds(new Set());
    setAppliedFilter({ fromDate, toDate, classFilter, operationFilter, keyword: searchText });
  };

  /** 정렬 변경 — 순서가 통째로 달라지므로 첫 페이지부터 다시 읽는다 */
  const handleSortChange = (sortBy: ManualSortBy, sortDir: SortDirection) => {
    setSort({ sortBy, sortDir });
    setPage(1);
    setSelectedIds(new Set());
  };

  /** 페이지 크기 변경 — 보이는 구간이 통째로 달라지므로 첫 페이지부터 다시 읽는다 */
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
    setSelectedIds(new Set());
  };

  const handleToggle = (id: number) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const handleToggleAll = () =>
    setSelectedIds((prev) => {
      const allChecked = rows.length > 0 && rows.every((row) => prev.has(row.id));
      return allChecked ? new Set() : new Set(rows.map((row) => row.id));
    });

  return {
    // 필터 입력값
    fromDate, setFromDate,
    toDate, setToDate,
    classFilter, setClassFilter,
    operationFilter, setOperationFilter,
    searchType, setSearchType,
    searchText, setSearchText,
    handleSearch,

    // 목록
    rows,
    total: data?.totalElements ?? 0,
    totalPages: data?.totalPages ?? 0,
    isFetching,
    isError,
    error: error as Error | null,
    refetch,

    // 페이지·선택
    page, setPage,
    pageSize,
    handlePageSizeChange,
    sort,
    handleSortChange,
    selectedIds,
    handleToggle,
    handleToggleAll,
    hasSelection: selectedIds.size > 0,

    // 선택 삭제
    deleteSelected: () => deleteMutation.mutateAsync([...selectedIds]),
    isDeleting: deleteMutation.isLoading,
  };
}
