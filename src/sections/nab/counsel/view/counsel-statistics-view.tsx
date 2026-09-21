import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isValid, set, startOfDay, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { NabThemeScope } from '../../_lib/NabThemeScope';
import { CARD_SHADOW, DARK, DISABLED, FIELD_SX, SECONDARY } from '../../_lib/tokens';
import StatisticsTable from '../components/StatisticsTable';
import DocumentPagination from '../components/DocumentPagination';
import DocumentToast from '../components/DocumentToast';
import type { DocumentToastSeverity } from '../components/DocumentToast';
import { useManualClasses } from '../hooks/use-manual-classes';
import {
  COUNSEL_SCREEN_LABEL,
  MANUAL_ADMIN_TYPE_LABEL,
  PAGE_SIZE,
  STATISTICS_TOASTS,
} from '../constant';
import { downloadMsgeStatExcel, getMsgeStatList } from '../../../../api/nab/counsel-backoffice';
import type {
  MsgeStatItem,
  MsgeStatManlDoc,
  MsgeStatRequest,
} from '../../../../api/nab/counsel-backoffice';
import type { StatisticsRow } from '../type';

/** 조회 버튼을 눌러야 실제 요청에 반영되는 값들 */
interface AppliedFilter {
  fromDate: Date | null;
  toDate: Date | null;
}

/** 시각 목록 간격 — 기본값(5분)이면 23:59 같은 값을 시계에서 고를 수 없다 */
const MINUTE_STEP = { hours: 1, minutes: 1 } as const;

/** 조회 일시 필드 — 폭은 Figma 11187:54594 기준 */
const DATETIME_FIELD_PROPS = {
  sx: { ...FIELD_SX, width: 328 },
  InputLabelProps: { shrink: true },
} as const;

/**
 * 화면 표기 형식 — 24시간제.
 *
 * 네이티브 datetime-local 은 브라우저 UI 로케일(ko-KR)을 따라 '오후 01:05' 로만 그려지고
 * lang 속성으로도 바뀌지 않는다. 그래서 DateTimePicker(ampm=false)로 24시간 표기를 강제한다.
 */
const DISPLAY_FORMAT = 'yyyy-MM-dd HH:mm';

/**
 * 기본 조회기간 — 최근 30일.
 * 서버가 '최대 30일, 최근 1년 이내' 로 제한하므로 오늘 포함 30일 구간을 기본값으로 둔다.
 * 시각은 시작일 00:00 ~ 종료일 23:59 로 잡아 날짜만 고르던 때와 같은 범위를 덮는다.
 */
const STATISTICS_PERIOD_DAYS = 30;

const defaultFilter = (): AppliedFilter => {
  const today = new Date();

  return {
    fromDate: startOfDay(subDays(today, STATISTICS_PERIOD_DAYS - 1)),
    toDate: set(today, { hours: 23, minutes: 59, seconds: 0, milliseconds: 0 }),
  };
};

const DEFAULT_FILTER = defaultFilter();

/**
 * 선택값 → API 형식(yyyy-MM-dd HH:mm).
 *
 * 서버는 'yyyy-MM-dd' 와 'yyyy-MM-dd HH:mm' 둘 다 받는데(초 단위는 400 으로 거절한다),
 * 시각을 생략하면 시작은 00:00·종료는 23:59:59 로 채운다. 화면에서 분까지 고르므로 항상 붙여 보낸다.
 * 값이 없거나 입력 중이라 유효하지 않으면 조건을 걸지 않는다.
 */
const toApiDateTime = (value: Date | null): string | undefined =>
  value && isValid(value) ? format(value, DISPLAY_FORMAT) : undefined;

/** 선택값 → 파일명 조각(yyyy-MM-dd_HHmm). 콜론은 파일명에 못 쓴다 */
const toFileNamePart = (value: Date | null): string =>
  value && isValid(value) ? format(value, 'yyyy-MM-dd_HHmm') : '';

/** API 일시(yyyy-MM-dd HH:mm:ss) → 화면 표기(YYYY.MM.DD HH:MM) */
const toDisplayDateTime = (value: string): string => {
  const [date, time = ''] = value.trim().split(' ');

  return `${date.replace(/-/g, '.')} ${time.slice(0, 5)}`.trim();
};

/** 값이 없는 칸은 '-' 로 채운다 (중지된 턴은 답변 계열이 모두 null 이다) */
const orDash = (value: string | number | null | undefined): string =>
  value === null || value === undefined || value === '' ? '-' : String(value);

/**
 * 답변이 참조한 매뉴얼 문서들에서 한 컬럼 값을 뽑아 잇는다.
 *
 * 한 턴이 여러 문서를 참조할 수 있어 값이 여러 개다. 중복은 접고 쉼표로 이어
 * 한 셀에 담는다(넘치면 표에서 말줄임 + 툴팁). 참조가 없으면 '-'.
 */
const joinManualField = (
  docs: MsgeStatManlDoc[],
  pick: (doc: MsgeStatManlDoc) => string | null | undefined,
): string => {
  const values = docs.map(pick).filter((value): value is string => !!value);

  return orDash([...new Set(values)].join(', '));
};

const toListRequest = (filter: AppliedFilter, page: number, size: number): MsgeStatRequest => ({
  rgstDttmFrom: toApiDateTime(filter.fromDate),
  rgstDttmTo: toApiDateTime(filter.toDate),
  page,
  size,
});

/** 통계 API 항목을 화면 행으로 옮긴다 */
const toStatisticsRow = (
  item: MsgeStatItem,
  index: number,
  classLabel: (code: string) => string,
): StatisticsRow => {
  // 참조 문서는 배열이라 컬럼 3개(담당부서·분류·문서명)가 같은 목록을 나눠 쓴다
  const manualDocs = item.manlDocList ?? [];

  return {
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
    // 관리주체·분류는 코드로 오므로 화면 표기로 바꾼다 (모르는 코드는 코드 그대로 둔다)
    dept: joinManualField(manualDocs, (doc) =>
      doc.nabCuslAdmrTypeCode
        ? MANUAL_ADMIN_TYPE_LABEL[doc.nabCuslAdmrTypeCode] ?? doc.nabCuslAdmrTypeCode
        : null),
    manualClass: joinManualField(manualDocs, (doc) =>
      doc.manlClsfCode ? classLabel(doc.manlClsfCode) : null),
    documentName: joinManualField(manualDocs, (doc) => doc.manlNm),
    code: orDash(item.rcmdQustId),
    question: item.qustCntn,
    answer: orDash(item.answCntn),
    model: orDash(item.llmNm),
    elapsedSec: orDash(item.rqrdTime),
    cost: orDash(item.costUsd),
    feedback: item.fdbkLikeYn === 'Y' ? '좋아요' : item.fdbkLikeYn === 'N' ? '싫어요' : '-',
    feedbackReason: orDash(item.fdbkCmmt),
  };
};

const fetchStatistics = async (
  filter: AppliedFilter,
  page: number,
  size: number,
  classLabel: (code: string) => string,
) => {
  const response = await getMsgeStatList(toListRequest(filter, page, size));

  if (response.error) {
    throw new Error(response.error.message ?? '통계 목록 조회에 실패했습니다.');
  }

  return {
    rows: (response.data?.msgeStatList ?? []).map((item, index) =>
      toStatisticsRow(item, index, classLabel)),
    // 페이징 정보는 본문이 아니라 공통 엔벨로프의 page 필드에 담긴다
    totalElements: response.page?.totalElements ?? 0,
    totalPages: response.page?.totalPages ?? 0,
  };
};

function CounselStatisticsViewInner() {
  const [fromDate, setFromDate] = useState(DEFAULT_FILTER.fromDate);
  const [toDate, setToDate] = useState(DEFAULT_FILTER.toDate);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE);
  const [appliedFilter, setAppliedFilter] = useState<AppliedFilter>(DEFAULT_FILTER);
  const [toast, setToast] = useState<{ message: string; severity: DocumentToastSeverity }>({
    message: '',
    severity: 'success',
  });

  // 참조 문서의 분류 표기는 서버 분류 목록에서 가져온다 (관리주체를 가리지 않고 전체)
  const { label: classLabel, isLoading: isClassLoading } = useManualClasses();

  const { data, isError, error, refetch } = useQuery(
    ['nab', 'counsel-backoffice', 'statistics-message-list', appliedFilter, page, pageSize],
    () => fetchStatistics(appliedFilter, page, pageSize, classLabel),
    { keepPreviousData: true, enabled: !isClassLoading },
  );

  const rows = data?.rows ?? [];

  /** 엑셀 다운로드 — 목록과 같은 필터로 전건을 받는다 */
  const excelMutation = useMutation(
    async () => {
      const blob = await downloadMsgeStatExcel(toListRequest(appliedFilter, page, pageSize));
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download =
        `상담AI_메시지통계_${toFileNamePart(appliedFilter.fromDate)}_${toFileNamePart(appliedFilter.toDate)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    },
    {
      onError: () => setToast({ message: STATISTICS_TOASTS.excelFail, severity: 'error' }),
    },
  );

  /** 페이지 크기 변경 — 보이는 구간이 통째로 달라지므로 첫 페이지부터 다시 읽는다 */
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

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
        {/* 필터 (조회일시) — 서버가 분 단위 구간을 받는다 */}
        <Box sx={{ px: 2.5, py: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <DateTimePicker
            label="조회 시작일시"
            value={fromDate}
            onChange={setFromDate}
            ampm={false}
            format={DISPLAY_FORMAT}
            timeSteps={MINUTE_STEP}
            slotProps={{ textField: DATETIME_FIELD_PROPS }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: 12, color: SECONDARY, flexShrink: 0 }}>~</Typography>
            <DateTimePicker
              label="조회 종료일시"
              value={toDate}
              onChange={setToDate}
              ampm={false}
              format={DISPLAY_FORMAT}
              timeSteps={MINUTE_STEP}
              slotProps={{ textField: DATETIME_FIELD_PROPS }}
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
          <StatisticsTable
            rows={rows}
            total={data?.totalElements ?? 0}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
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
      {/* 달력·시계 팝업의 요일/월 표기를 한국어로 맞춘다 (시각은 ampm=false 로 24시간 고정) */}
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
        <CounselStatisticsViewInner />
      </LocalizationProvider>
    </NabThemeScope>
  );
}
