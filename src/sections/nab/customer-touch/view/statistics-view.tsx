import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { NabThemeScope } from '../../_lib/NabThemeScope';
import { Alert, Box, Typography, Card, Breadcrumbs, Button, CircularProgress } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import StatisticsTabs from '../components/StatisticsTabs';
import StatisticsFilter from '../components/StatisticsFilter';
import DailyStatsTable from '../components/DailyStatsTable';
import StatisticsPagination from '../components/StatisticsPagination';
import { DARK, DISABLED, CARD_SHADOW, PRIMARY_ORANGE } from '../../_lib/tokens';
import {
  CONTENT_SEARCH_STAT_COLUMNS,
  FILTER_ALL,
  MESSAGE_STAT_COLUMNS,
  STAT_FP_TYPE,
  defaultStatPeriod,
  toStatApiDate,
} from '../constant';
import {
  downloadStatsMessageExcel,
  downloadStatsSearchExcel,
  getStatsMessageDaily,
  getStatsSearchDaily,
} from '../../../../api/nab/customer-touch';
import type {
  MessageStatsRow,
  Pagination,
  SearchStatsRow,
  StatsPageSize,
} from '../../../../api/nab/customer-touch';
import { toApiErrorMessage } from '../../../../api/nab/_lib/error';
import type { ContentSearchStatRow, MessageStatRow } from '../type';

/**
 * 탭마다 표 양식이 달라 행 타입도 다르다. 어느 쪽 결과인지 kind 로 구분해
 * 렌더에서 좁혀 쓴다 (캐스팅 없이 타입이 맞물린다).
 */
type StatsQueryResult =
  | { kind: 'message'; rows: MessageStatRow[]; pagination?: Pagination }
  | { kind: 'search'; rows: ContentSearchStatRow[]; pagination?: Pagination };

/** 페이지 크기 — API 가 10/30/50/70/100 만 받는다 */
const PAGE_SIZE: StatsPageSize = 10;

const DEFAULT_PERIOD = defaultStatPeriod();

/** 조회 버튼을 눌러야 실제 요청에 반영되는 값들 */
interface AppliedFilter {
  fromDate: string;
  toDate: string;
  type: string;
}

/** 메시지 통계 응답 한 줄 → 표의 한 행 (지표가 1:1이라 그대로 옮긴다) */
const toMessageStatRow = (item: MessageStatsRow): MessageStatRow => ({
  date: item.statDate,
  fpUv: item.fpUvCount.toLocaleString(),
  generate: item.generateCount.toLocaleString(),
  modify: item.modifyCount.toLocaleString(),
  send: item.sendCount.toLocaleString(),
  sendCustomerUv: item.sendCustomerUvCount.toLocaleString(),
});

/** 검색 통계 응답 한 줄 → 표의 한 행 */
const toContentSearchStatRow = (item: SearchStatsRow): ContentSearchStatRow => ({
  date: item.statDate,
  fpUv: item.fpUvCount.toLocaleString(),
  search: item.searchCount.toLocaleString(),
});

/** 메시지 탭 — 채널 그룹 컬럼이 없어져 조회가 1회로 끝난다. 유형(FP유형)은 필터로 받는다 */
const fetchMessageStats = async (filter: AppliedFilter, page: number): Promise<StatsQueryResult> => {
  const response = await getStatsMessageDaily({
    from: toStatApiDate(filter.fromDate),
    to: toStatApiDate(filter.toDate),
    fpType: STAT_FP_TYPE[filter.type] ?? 'ALL',
    pageNum: page,
    pageSize: PAGE_SIZE,
  });

  if (response.error) {
    throw new Error(response.error.message ?? '통계 조회에 실패했습니다.');
  }

  return {
    kind: 'message',
    rows: (response.data?.list ?? []).map(toMessageStatRow),
    // 총 건수는 큐브 행 수가 아니라 조회 기간의 일수다
    pagination: response.data?.pagination,
  };
};

/** 콘텐츠 검색 탭 — 메시지 탭과 같은 축(기간·유형)을 쓴다 */
const fetchSearchStats = async (filter: AppliedFilter, page: number): Promise<StatsQueryResult> => {
  const response = await getStatsSearchDaily({
    from: toStatApiDate(filter.fromDate),
    to: toStatApiDate(filter.toDate),
    fpType: STAT_FP_TYPE[filter.type] ?? 'ALL',
    pageNum: page,
    pageSize: PAGE_SIZE,
  });

  if (response.error) {
    throw new Error(response.error.message ?? '통계 조회에 실패했습니다.');
  }

  return {
    kind: 'search',
    rows: (response.data?.list ?? []).map(toContentSearchStatRow),
    // 총 건수는 큐브 행 수가 아니라 조회 기간의 일수다
    pagination: response.data?.pagination,
  };
};

/** Blob 을 파일로 내려받는다 */
const saveBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

function StatisticsViewInner() {
  const [tabValue, setTabValue] = useState(0);
  const [fromDate, setFromDate] = useState(DEFAULT_PERIOD.from);
  const [toDate, setToDate] = useState(DEFAULT_PERIOD.to);
  const [typeFilter, setTypeFilter] = useState(FILTER_ALL);
  const [page, setPage] = useState(1);
  const [appliedFilter, setAppliedFilter] = useState<AppliedFilter>({
    fromDate: DEFAULT_PERIOD.from,
    toDate: DEFAULT_PERIOD.to,
    type: FILTER_ALL,
  });

  // 탭 0 = AI 메시지 생성, 탭 1 = AI 콘텐츠 검색 — 표 양식이 서로 달라 컴포넌트도 나뉜다
  const isContentSearch = tabValue === 1;

  const { data, isFetching, isError, error, refetch } = useQuery(
    ['nab', 'customer-touch', 'service-stats', isContentSearch ? 'search' : 'message', appliedFilter, page],
    () =>
      isContentSearch
        ? fetchSearchStats(appliedFilter, page)
        : fetchMessageStats(appliedFilter, page),
    { keepPreviousData: true },
  );

  const totalElements = data?.pagination?.totalElements ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 0;

  /** 엑셀 다운로드 — 탭에 맞는 API 로, 목록과 같은 필터(기간·유형)의 전건을 받는다 */
  const excelMutation = useMutation(
    async () => {
      const period = { from: toStatApiDate(appliedFilter.fromDate), to: toStatApiDate(appliedFilter.toDate) };
      const label = isContentSearch ? '콘텐츠검색' : '메시지생성';

      const fpType = STAT_FP_TYPE[appliedFilter.type] ?? 'ALL';

      const blob = isContentSearch
        ? await downloadStatsSearchExcel({ ...period, fpType })
        : await downloadStatsMessageExcel({ ...period, fpType });

      saveBlob(blob, `고객AI_${label}통계_${appliedFilter.fromDate}_${appliedFilter.toDate}.xlsx`);
    },
  );

  /** 조회 — 현재 입력값을 조회 조건으로 확정하고 첫 페이지부터 다시 읽는다 */
  const handleSearch = () => {
    setPage(1);
    setAppliedFilter({ fromDate, toDate, type: typeFilter });
  };

  /** 탭이 바뀌면 지표·API 가 통째로 달라지므로 첫 페이지부터 다시 읽는다 */
  const handleTabChange = (value: number) => {
    setTabValue(value);
    setPage(1);
  };

  return (
    <>
      {/* Breadcrumb + Title */}
      <Box sx={{ mb: 5, pt: 3 }}>
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />} sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>AI 비서</Typography>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>고객 Plus AI 관리</Typography>
          <Typography sx={{ fontSize: 14, color: DISABLED }}>서비스 통계</Typography>
        </Breadcrumbs>
        <Typography variant="h4" sx={{ fontWeight: 700, color: DARK, fontSize: 24 }}>
          서비스 통계
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: CARD_SHADOW }}>
        <StatisticsTabs value={tabValue} onChange={handleTabChange} />
        <StatisticsFilter
          fromDate={fromDate}
          onFromDateChange={setFromDate}
          toDate={toDate}
          onToDateChange={setToDate}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
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
            {toApiErrorMessage(error, '통계를 불러오지 못했습니다.')}
          </Alert>
        )}

        <Box sx={{ position: 'relative' }}>
          {(isFetching || excelMutation.isLoading) && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              <CircularProgress size={24} sx={{ color: PRIMARY_ORANGE }} />
            </Box>
          )}

          {isContentSearch ? (
            <DailyStatsTable
              rows={data?.kind === 'search' ? data.rows : []}
              columns={CONTENT_SEARCH_STAT_COLUMNS}
              total={totalElements}
              pageSize={String(PAGE_SIZE)}
              onExcelDownload={() => excelMutation.mutate()}
            />
          ) : (
            <DailyStatsTable
              rows={data?.kind === 'message' ? data.rows : []}
              columns={MESSAGE_STAT_COLUMNS}
              total={totalElements}
              pageSize={String(PAGE_SIZE)}
              onExcelDownload={() => excelMutation.mutate()}
            />
          )}
        </Box>

        <StatisticsPagination page={page} totalPages={totalPages} onChange={setPage} />
      </Card>

      {excelMutation.isError && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }} onClose={() => excelMutation.reset()}>
          {toApiErrorMessage(excelMutation.error, '엑셀 다운로드에 실패했습니다.')}
        </Alert>
      )}
    </>
  );
}

export default function StatisticsView() {
  return (
    <NabThemeScope>
      <StatisticsViewInner />
    </NabThemeScope>
  );
}
