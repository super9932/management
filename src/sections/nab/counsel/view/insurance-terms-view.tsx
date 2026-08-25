import { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CircularProgress,
  Typography,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { NabThemeScope } from '../../_lib/NabThemeScope';
import { CARD_SHADOW, DARK, DISABLED, PRIMARY_ORANGE, SECONDARY } from '../../_lib/tokens';
import DocumentFilter from '../components/DocumentFilter';
import DocumentTable from '../components/DocumentTable';
import DocumentTermsRegisterDialog from '../components/DocumentTermsRegisterDialog';
import InsuranceTermsDetailDialog from '../components/InsuranceTermsDetailDialog';
import DocumentPagination from '../components/DocumentPagination';
import type { DocumentRow } from '../type';
import {
  PAGE_SIZE,
  TERMS_OPERATION_FILTER_OPTIONS,
  TERMS_SEARCH_TYPE_CODE,
  TERMS_SEARCH_TYPE_OPTIONS,
  TERMS_STATUS_CODE,
  TERMS_STATUS_LABEL,
} from '../constant';
import { getStipulationList } from '../../../../api/nab/counsel-backoffice';
import type { StipulationItem, StipulationListRequest } from '../../../../api/nab/counsel-backoffice';

/** 조회 버튼을 눌러야 실제 요청에 반영되는 값들 */
interface AppliedFilter {
  fromDate: string;
  toDate: string;
  operationFilter: string;
  searchType: string;
  keyword: string;
}

const DEFAULT_FILTER: AppliedFilter = {
  fromDate: '2026.01.01',
  toDate: '2026.12.31',
  operationFilter: '전체',
  searchType: '문서명',
  keyword: '',
};

/** 화면 표기(YYYY.MM.DD) → API 형식(yyyy-MM-dd). 비어 있으면 조건을 걸지 않는다 */
const toApiDate = (value: string): string | undefined => {
  const date = value.trim().replace(/\./g, '-').replace(/-$/, '');

  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined;
};

/** API 형식(yyyy-MM-dd[ HH:mm:ss]) → 화면 표기(YYYY.MM.DD) */
const toDisplayDate = (value: string | null): string =>
  value ? value.trim().split(' ')[0].replace(/-/g, '.') : '-';

const toListRequest = (filter: AppliedFilter, page: number): StipulationListRequest => ({
  rgstDttmFrom: toApiDate(filter.fromDate),
  rgstDttmTo: toApiDate(filter.toDate),
  status: TERMS_STATUS_CODE[filter.operationFilter],
  searchType: TERMS_SEARCH_TYPE_CODE[filter.searchType],
  keyword: filter.keyword.trim() || undefined,
  page,
  size: PAGE_SIZE,
});

/** 목록 API 항목을 화면 행으로 옮긴다 */
const toDocumentRow = (item: StipulationItem): DocumentRow => ({
  id: item.nabCuslIsrnStplDcmtId,
  no: item.nabCuslIsrnStplDcmtId,
  // 보종세목코드는 여러 개 — 표에서 줄바꿈되도록 쉼표로 잇는다(전처리 전이면 빈 값)
  productCodes: item.isrnKindCodeList.join(', '),
  salePeriodStart: toDisplayDate(item.saleStarDate),
  salePeriodEnd: toDisplayDate(item.saleEndDate),
  documentName: item.pdfDcmtFileNm,
  csvDocumentName: item.csvDcmtFileNm,
  registrantName: item.rgsrNm,
  registrantDept: item.rgstOrgnNm,
  registeredAt: toDisplayDate(item.rgstDttm),
  operationStatus: TERMS_STATUS_LABEL[item.status],
});

const fetchStipulations = async (filter: AppliedFilter, page: number) => {
  const response = await getStipulationList(toListRequest(filter, page));

  if (response.error) {
    throw new Error(response.error.message ?? '약관문서 목록 조회에 실패했습니다.');
  }

  return {
    rows: (response.data?.stplDocList ?? []).map(toDocumentRow),
    // 페이징 정보는 본문이 아니라 공통 엔벨로프의 page 필드에 담긴다
    totalElements: response.page?.totalElements ?? 0,
    totalPages: response.page?.totalPages ?? 0,
  };
};

function InsuranceTermsViewInner() {
  const [fromDate, setFromDate] = useState(DEFAULT_FILTER.fromDate);
  const [toDate, setToDate] = useState(DEFAULT_FILTER.toDate);
  const [operationFilter, setOperationFilter] = useState(DEFAULT_FILTER.operationFilter);
  const [searchType, setSearchType] = useState(DEFAULT_FILTER.searchType);
  const [searchText, setSearchText] = useState(DEFAULT_FILTER.keyword);
  const [page, setPage] = useState(1);
  const [appliedFilter, setAppliedFilter] = useState<AppliedFilter>(DEFAULT_FILTER);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [registerOpen, setRegisterOpen] = useState(false);
  const [detailRow, setDetailRow] = useState<DocumentRow | null>(null);

  const { data, isFetching, isError, error, refetch } = useQuery(
    ['nab', 'counsel-backoffice', 'stipulation-list', appliedFilter, page],
    () => fetchStipulations(appliedFilter, page),
    { keepPreviousData: true },
  );

  const rows = data?.rows ?? [];
  const total = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;

  /** 조회 — 현재 입력값을 조회 조건으로 확정하고 첫 페이지부터 다시 읽는다 */
  const handleSearch = () => {
    setPage(1);
    setSelectedIds(new Set());
    setAppliedFilter({ fromDate, toDate, operationFilter, searchType, keyword: searchText });
  };

  const handleToggle = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleAll = () => {
    setSelectedIds((prev) => {
      const allChecked = rows.length > 0 && rows.every((row) => prev.has(row.id));
      return allChecked ? new Set() : new Set(rows.map((row) => row.id));
    });
  };

  const hasSelection = selectedIds.size > 0;

  return (
    <>
      {/* Breadcrumb + Title */}
      <Box sx={{ mb: 5, pt: 3 }}>
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />} sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>FP 비서</Typography>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>상담 Plus AI</Typography>
          <Typography sx={{ fontSize: 14, color: DISABLED }}>보험약관 문서</Typography>
        </Breadcrumbs>
        <Typography variant="h4" sx={{ fontWeight: 700, color: DARK, fontSize: 24 }}>
          보험약관 문서
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: CARD_SHADOW }}>
        <DocumentFilter
          fromDate={fromDate}
          onFromDateChange={setFromDate}
          toDate={toDate}
          onToDateChange={setToDate}
          operationFilter={operationFilter}
          onOperationFilterChange={setOperationFilter}
          operationFilterOptions={TERMS_OPERATION_FILTER_OPTIONS}
          searchType={searchType}
          onSearchTypeChange={setSearchType}
          searchTypeOptions={TERMS_SEARCH_TYPE_OPTIONS}
          searchText={searchText}
          onSearchTextChange={setSearchText}
          onSearch={handleSearch}
        />

        {isError && (
          <Alert
            severity="error"
            sx={{ borderRadius: 0 }}
            action={
              <Button color="inherit" size="small" onClick={() => refetch()}>
                재시도
              </Button>
            }
          >
            {(error as Error)?.message ?? '약관문서 목록을 불러오지 못했습니다.'}
          </Alert>
        )}

        <Box sx={{ position: 'relative' }}>
          {isFetching && (
            <Box
              sx={{
                position: 'absolute', inset: 0, zIndex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              <CircularProgress size={24} sx={{ color: PRIMARY_ORANGE }} />
            </Box>
          )}

          <DocumentTable
            rows={rows}
            total={total}
            pageSize={PAGE_SIZE}
            selectedIds={selectedIds}
            onToggle={handleToggle}
            onToggleAll={handleToggleAll}
            onDocumentClick={setDetailRow}
          />
        </Box>

        {/* 페이지네이션(중앙) + 액션(우측) */}
        <Box sx={{ position: 'relative' }}>
          <DocumentPagination page={page} totalPages={totalPages} onChange={setPage} />
          <Box
            sx={{
              position: 'absolute', right: 20, top: 0, bottom: 0,
              display: 'flex', alignItems: 'center', gap: 1,
            }}
          >
            <Button
              variant="outlined"
              disabled={!hasSelection}
              sx={{
                height: 40, px: 2, borderRadius: 2, fontSize: 14, fontWeight: 400,
                color: DARK, borderColor: 'var(--nab-border-strong)',
                '&:hover': { borderColor: SECONDARY, bgcolor: 'transparent' },
                '&.Mui-disabled': { color: DISABLED, borderColor: 'var(--nab-border)' },
              }}
            >
              선택 삭제
            </Button>
            <Button
              variant="contained"
              onClick={() => setRegisterOpen(true)}
              sx={{
                height: 40, px: 2, borderRadius: 2, fontSize: 15, fontWeight: 400,
                bgcolor: 'rgba(140,149,157,0.16)', color: DARK, boxShadow: 'none',
                '&:hover': { bgcolor: 'rgba(140,149,157,0.28)', boxShadow: 'none' },
              }}
            >
              문서 등록
            </Button>
          </Box>
        </Box>
      </Card>

      <InsuranceTermsDetailDialog
        open={detailRow !== null}
        row={detailRow}
        onClose={() => setDetailRow(null)}
      />

      <DocumentTermsRegisterDialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />
    </>
  );
}

export default function InsuranceTermsView() {
  return (
    <NabThemeScope>
      <InsuranceTermsViewInner />
    </NabThemeScope>
  );
}
