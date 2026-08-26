import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { NabThemeScope } from '../../_lib/NabThemeScope';
import { CARD_SHADOW, DARK, DISABLED, FIELD_SX, PRIMARY_ORANGE, SECONDARY } from '../../_lib/tokens';
import StatisticsTable from '../components/StatisticsTable';
import DocumentPagination from '../components/DocumentPagination';
import DocumentToast from '../components/DocumentToast';
import type { DocumentToastSeverity } from '../components/DocumentToast';
import {
  COUNSEL_SCREEN_LABEL,
  PAGE_SIZE,
  STATISTICS_TOASTS,
} from '../constant';
import { downloadMsgeStatExcel, getMsgeStatList } from '../../../../api/nab/counsel-backoffice';
import type { MsgeStatItem, MsgeStatRequest } from '../../../../api/nab/counsel-backoffice';
import type { StatisticsRow } from '../type';

const calendarAdornment = (
  <InputAdornment position="end">
    <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: SECONDARY }} />
  </InputAdornment>
);

/** 조회 버튼을 눌러야 실제 요청에 반영되는 값들 */
interface AppliedFilter {
  fromDate: string;
  toDate: string;
}

/** 화면 표기(YYYY.MM.DD)로 만든 날짜 — 로컬 기준이라 UTC 로 밀리지 않는다 */
const toScreenDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${date.getFullYear()}.${month}.${day}`;
};

/**
 * 기본 조회기간 — 최근 30일.
 * 서버가 '최대 30일, 최근 1년 이내' 로 제한하므로 오늘 포함 30일 구간을 기본값으로 둔다.
 */
const STATISTICS_PERIOD_DAYS = 30;

const defaultFilter = (): AppliedFilter => {
  const today = new Date();
  const from = new Date(today);
  from.setDate(from.getDate() - (STATISTICS_PERIOD_DAYS - 1));

  return { fromDate: toScreenDate(from), toDate: toScreenDate(today) };
};

const DEFAULT_FILTER = defaultFilter();

/** 화면 표기(YYYY.MM.DD) → API 형식(yyyy-MM-dd). 형식이 안 맞으면 조건을 걸지 않는다 */
const toApiDate = (value: string): string | undefined => {
  const date = value.trim().replace(/[./]/g, '-').replace(/-$/, '');

  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined;
};

/** API 일시(yyyy-MM-dd HH:mm:ss) → 화면 표기(YYYY.MM.DD HH:MM) */
const toDisplayDateTime = (value: string): string => {
  const [date, time = ''] = value.trim().split(' ');

  return `${date.replace(/-/g, '.')} ${time.slice(0, 5)}`.trim();
};

/** 값이 없는 칸은 '-' 로 채운다 (중지된 턴은 답변 계열이 모두 null 이다) */
const orDash = (value: string | number | null | undefined): string =>
  value === null || value === undefined || value === '' ? '-' : String(value);

const toListRequest = (filter: AppliedFilter, page: number): MsgeStatRequest => ({
  rgstDttmFrom: toApiDate(filter.fromDate),
  rgstDttmTo: toApiDate(filter.toDate),
  page,
  size: PAGE_SIZE,
});

/** 통계 API 항목을 화면 행으로 옮긴다 */
const toStatisticsRow = (item: MsgeStatItem, index: number): StatisticsRow => ({
  // 응답에 행 식별자가 없어 목록 내 순번을 key 로 쓴다
  id: index,
  datetime: toDisplayDateTime(item.rgstDttm),
  userId: item.fpUniqNo,
  division: orDash(item.lvl1OrgnNm),
  region: orDash(item.lvl2OrgnNm),
  district: orDash(item.lvl3OrgnNm),
  branch: orDash(item.lvl4OrgnNm),
  roomId: item.convRoomId,
  // 화면 구분 코드는 FE 가 표시명으로 바꾼다
  screen: COUNSEL_SCREEN_LABEL[item.cuslSrvcTypeCode] ?? item.cuslSrvcTypeCode,
  code: orDash(item.rcmdQustId),
  question: item.qustCntn,
  answer: orDash(item.answCntn),
  model: orDash(item.llmNm),
  elapsedSec: orDash(item.rqrdTime),
  cost: orDash(item.costUsd),
  feedback: item.fdbkLikeYn === 'Y' ? '좋아요' : item.fdbkLikeYn === 'N' ? '싫어요' : '-',
  feedbackReason: orDash(item.fdbkCmmt),
});

const fetchStatistics = async (filter: AppliedFilter, page: number) => {
  const response = await getMsgeStatList(toListRequest(filter, page));

  if (response.error) {
    throw new Error(response.error.message ?? '통계 목록 조회에 실패했습니다.');
  }

  return {
    rows: (response.data?.msgeStatList ?? []).map(toStatisticsRow),
    // 페이징 정보는 본문이 아니라 공통 엔벨로프의 page 필드에 담긴다
    totalElements: response.page?.totalElements ?? 0,
    totalPages: response.page?.totalPages ?? 0,
  };
};

function CounselStatisticsViewInner() {
  const [fromDate, setFromDate] = useState(DEFAULT_FILTER.fromDate);
  const [toDate, setToDate] = useState(DEFAULT_FILTER.toDate);
  const [page, setPage] = useState(1);
  const [appliedFilter, setAppliedFilter] = useState<AppliedFilter>(DEFAULT_FILTER);
  const [toast, setToast] = useState<{ message: string; severity: DocumentToastSeverity }>({
    message: '',
    severity: 'success',
  });

  const { data, isFetching, isError, error, refetch } = useQuery(
    ['nab', 'counsel-backoffice', 'statistics-message-list', appliedFilter, page],
    () => fetchStatistics(appliedFilter, page),
    { keepPreviousData: true },
  );

  const rows = data?.rows ?? [];

  /** 엑셀 다운로드 — 목록과 같은 필터로 전건을 받는다 */
  const excelMutation = useMutation(
    async () => {
      const blob = await downloadMsgeStatExcel(toListRequest(appliedFilter, page));
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `상담AI_메시지통계_${appliedFilter.fromDate}_${appliedFilter.toDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    },
    {
      onError: () => setToast({ message: STATISTICS_TOASTS.excelFail, severity: 'error' }),
    },
  );

  /** 조회 — 현재 입력값을 조회 조건으로 확정하고 첫 페이지부터 다시 읽는다 */
  const handleSearch = () => {
    setPage(1);
    setAppliedFilter({ fromDate, toDate });
  };

  return (
    <>
      {/* Breadcrumb + Title */}
      <Box sx={{ mb: 5, pt: 3 }}>
        <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />} sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>FP 비서</Typography>
          <Typography sx={{ fontSize: 14, color: DARK, cursor: 'pointer' }}>상담 Plus AI</Typography>
          <Typography sx={{ fontSize: 14, color: DISABLED }}>통계 관리</Typography>
        </Breadcrumbs>
        <Typography variant="h4" sx={{ fontWeight: 700, color: DARK, fontSize: 24 }}>
          통계 관리
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 4, boxShadow: CARD_SHADOW }}>
        {/* 필터 (조회일자) */}
        <Box sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 426 }}>
            <TextField
              label="조회일자"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ endAdornment: calendarAdornment }}
              sx={{ ...FIELD_SX, flex: 1 }}
            />
            <Typography sx={{ fontSize: 12, color: SECONDARY, flexShrink: 0 }}>~</Typography>
            <TextField
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ endAdornment: calendarAdornment }}
              sx={{ ...FIELD_SX, flex: 1 }}
            />
          </Box>
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              height: 48, px: 2, borderRadius: 2, bgcolor: 'var(--nab-button)', color: 'white',
              fontSize: 15, fontWeight: 400, whiteSpace: 'nowrap', flexShrink: 0,
              boxShadow: 'none', '&:hover': { bgcolor: 'var(--nab-button-hover)', boxShadow: 'none' },
            }}
          >
            조회
          </Button>
        </Box>

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
            {(error as Error)?.message ?? '통계 목록을 불러오지 못했습니다.'}
          </Alert>
        )}

        <Box sx={{ position: 'relative' }}>
          {(isFetching || excelMutation.isLoading) && (
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

          <StatisticsTable
            rows={rows}
            total={data?.totalElements ?? 0}
            pageSize={PAGE_SIZE}
            onExcelDownload={() => excelMutation.mutate()}
          />
        </Box>

        <DocumentPagination page={page} totalPages={data?.totalPages ?? 0} onChange={setPage} />
      </Card>

      <DocumentToast
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, message: '' }))}
      />
    </>
  );
}

export default function CounselStatisticsView() {
  return (
    <NabThemeScope>
      <CounselStatisticsViewInner />
    </NabThemeScope>
  );
}
