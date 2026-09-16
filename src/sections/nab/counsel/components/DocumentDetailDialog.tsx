import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  DARK,
  DISABLED,
  DIVIDER,
  FIELD_SX,
  POPUP_BG,
  PRIMARY_ORANGE,
  SECONDARY,
  SECONDARY_16,
} from '../../_lib/tokens';
import {
  DOCUMENT_ALERTS,
  DOCUMENT_DETAIL_TOASTS,
  MANUAL_CLASS_BY_ADMIN_TYPE,
  MANUAL_CLASS_LABEL,
  MANUAL_STATUS_LABEL,
  OPERATION_STATUS_OPTIONS,
  TIME_OPTIONS,
} from '../constant';
import { isRestrictedWorkTime, toApiDateTime } from '../lib/document-attachment';
import DocumentAlertDialog from './DocumentAlertDialog';
import DocumentToast from './DocumentToast';
import type { DocumentToastSeverity } from './DocumentToast';
import {
  deleteManual,
  getManualDetail,
  getManualHistoryList,
  updateManual,
} from '../../../../api/nab/counsel-backoffice';
import type {
  ManualClassCode,
  ManualDetailResponse,
  ManualHistoryItem,
} from '../../../../api/nab/counsel-backoffice';
import type { OperationStatus, ReviewHistoryEntry } from '../type';
import { useAuthContext } from 'src/auth/hooks';

/**
 * 문서 상세 팝업 (Figma COM_공통정의_003).
 *
 * 보험심사·보험공통·언더라이팅 매뉴얼 상세가 같은 구조를 쓴다(화면별 차이는 title 뿐).
 * 보험약관 문서 상세는 UI가 달라 별도 컴포넌트(InsuranceTermsDetailDialog)로 둔다.
 */

/** 상세 팝업이 필요로 하는 행 정보 — 화면별 Row 타입의 공통 부분 */
export interface DocumentDetailRow {
  id: number;
  no: number;
  documentName: string;
  registrantName: string;
  registrantDept: string;
  registeredAt: string;
  operationStatus: OperationStatus;
  /** 반영일자 (3-C) */
  effectiveStart?: string;
  /** 종료일자 (3-D) */
  effectiveEnd?: string;
}

interface Props {
  open: boolean;
  /** 팝업 타이틀 — '{담당 부서} 문서 상세' 형식 (1-A) */
  title: string;
  row: DocumentDetailRow | null;
  onClose: () => void;
  /** 삭제 성공 시 목록 갱신용 (10-C) */
  onDeleted?: (row: DocumentDetailRow) => void;
  /** 문서 다운로드 — 모달을 닫은 뒤 호출된다 (9-B) */
  onDownload?: (row: DocumentDetailRow) => void;
}

/** 본문 카드 — 연회색 팝업 배경 위에 얹히는 흰 카드 */
const sectionSx = {
  bgcolor: 'var(--nab-surface)',
  borderRadius: 4,
  p: 2.5,
} as const;

const labelSx = { fontSize: 14, color: SECONDARY } as const;
const valueSx = { fontSize: 14, color: DARK } as const;
const strongValueSx = { fontSize: 16, color: DARK } as const;

/** 정보 카드의 열 구분선 — 마지막 열을 뺀 나머지 열 오른쪽에 점선을 둔다 */
const infoColumnSx = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  borderRight: `1px dashed ${DIVIDER}`,
} as const;

const lastInfoColumnSx = { ...infoColumnSx, borderRight: 'none' } as const;

const selectFieldSx = {
  fontSize: 14,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: DIVIDER },
  borderRadius: 2,
  height: 54,
} as const;

/** 문서번호처럼 수정할 수 없는 입력칸은 점선 테두리로 구분한다 */
const readOnlyFieldSx = {
  ...FIELD_SX,
  flex: 1,
  '& .MuiOutlinedInput-root': {
    ...FIELD_SX['& .MuiOutlinedInput-root'],
    '& fieldset': { borderStyle: 'dashed', borderColor: 'var(--nab-border)' },
    '&:hover fieldset': { borderStyle: 'dashed', borderColor: 'var(--nab-border)' },
  },
} as const;

/** 하단 액션 버튼 공통 — 높이 36 / radius 8 / 좌우 12 */
const actionButtonSx = {
  height: 36,
  minWidth: 64,
  px: 1.5,
  borderRadius: 2,
  fontSize: 14,
  fontWeight: 400,
} as const;

const labelSmallSx = { fontSize: 12, fontWeight: 700, color: SECONDARY } as const;

/** 편집 가능한 운영 설정 — 변경 여부(dirty) 판정 단위 */
interface OperationForm {
  operationStatus: OperationStatus;
  /** 매뉴얼 분류. 상세가 오기 전이거나 분류 도입 이전 등록분이면 '' */
  classCode: ManualClassCode | '';
  effectiveDate: string;
  effectiveTime: string;
  endDate: string;
  endTime: string;
  noEndDate: boolean;
}

/** 목록은 값이 없는 일자를 '-' 로 내려준다 */
const isBlankDate = (value?: string): boolean => {
  const trimmed = value?.trim();

  return !trimmed || trimmed === '-';
};

/** 'YYYY.MM.DD' 또는 'YYYY.MM.DD HH:MM' 에서 일자만 떼어낸다 */
const toDatePart = (value: string | undefined, fallback: string): string =>
  (isBlankDate(value) ? '' : value?.trim().split(' ')[0]) || fallback;

/** 'YYYY.MM.DD' → Date. 파싱할 수 없으면 null */
const parseDate = (value?: string): Date | null => {
  const date = value?.trim().split(' ')[0].replace(/\./g, '-');
  if (!date) return null;

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * 드롭다운에 표시할 운영상태를 정한다 (COM_공통정의_003 3-C/3-D).
 *
 * 목록이 내려주는 상태('오류'·'처리중')는 상세 드롭다운 옵션(운영중/대기중)에 없다.
 * 그 경우 반영일자 미도래 또는 종료일자 도래면 '대기중', 그 사이면 '운영중'으로 계산한다.
 */
const resolveOperationStatus = (row: DocumentDetailRow): OperationStatus => {
  if ((OPERATION_STATUS_OPTIONS as readonly string[]).includes(row.operationStatus)) {
    return row.operationStatus;
  }

  const now = new Date();
  const effective = isBlankDate(row.effectiveStart) ? null : parseDate(row.effectiveStart);
  const end = isBlankDate(row.effectiveEnd) ? null : parseDate(row.effectiveEnd);

  if (effective && now < effective) return '대기중';
  if (end && now >= end) return '대기중';

  return '운영중';
};

const initialForm = (row: DocumentDetailRow): OperationForm => ({
  operationStatus: resolveOperationStatus(row),
  // 목록에는 분류 코드가 없어 상세 응답이 도착하면 채워진다
  classCode: '',
  effectiveDate: toDatePart(row.effectiveStart, '2026-01-01'),
  effectiveTime: '00:00',
  endDate: toDatePart(row.effectiveEnd, '2027-12-31'),
  endTime: '24:00',
  // 종료일자 미지정은 최초 진입 시 선택 상태 (3-E)
  noEndDate: isBlankDate(row.effectiveEnd),
});

/** 'yyyy-MM-dd HH:mm:ss' → 화면 일자 'yyyy-MM-dd' (네이티브 date 인풋 형식) */
const toFormDate = (value: string | null, fallback: string): string =>
  value ? value.trim().split(' ')[0] : fallback;

/**
 * 'yyyy-MM-dd HH:mm:ss' → 화면 일시 'HH:MM'.
 * 종료일시는 23:59:59(그 날의 끝)로 저장돼 오므로 화면 옵션의 24:00 으로 맞춘다.
 */
const toFormTime = (value: string | null, fallback: string): string => {
  const time = value?.trim().split(' ')[1];
  if (!time) return fallback;

  const [hour, minute] = time.split(':');
  if (hour === '23' && minute === '59') return '24:00';

  // 30분 단위 옵션에 없는 값은 아래로 스냅한다
  const snapped = `${hour}:${Number(minute) >= 30 ? '30' : '00'}`;

  return (TIME_OPTIONS as readonly string[]).includes(snapped) ? snapped : fallback;
};

/** 이름·사번을 '이름(사번)' 형식으로 (COM_공통정의_003 6-A/7-A) */
const toPersonLabel = (name: string, employeeNo: string): string =>
  employeeNo ? `${name}(${employeeNo})` : name;

/** 상세 응답으로 운영 설정 폼을 만든다 */
const detailToForm = (detail: ManualDetailResponse): OperationForm => ({
  operationStatus: MANUAL_STATUS_LABEL[detail.status],
  classCode: detail.manlClsfCode ?? '',
  effectiveDate: toFormDate(detail.valdStarDttm, '2026-01-01'),
  effectiveTime: toFormTime(detail.valdStarDttm, '00:00'),
  endDate: toFormDate(detail.valdEndDttm, '2027-12-31'),
  endTime: toFormTime(detail.valdEndDttm, '24:00'),
  // 유효종료일시가 없으면 무기한 운영 = 종료일자 미지정
  noEndDate: detail.valdEndDttm === null,
});

/** 변경된 속성(원천 컬럼ID) → 화면 라벨. 매핑은 FE 몫이다 */
const HISTORY_COLUMN_LABEL: Record<string, string> = {
  VALD_STAR_DTTM: '반영일자',
  VALD_END_DTTM: '종료일자',
  MANL_CLSF_CODE: '분류',
};

/** 이력 값 'yyyy-MM-dd HH:mm:ss' → 'YYYY.MM.DD HH:MM'. null 은 무기한(미지정) */
const toHistoryValue = (value: string | null): string => {
  if (!value) return '미지정';

  const [date, time = ''] = value.trim().split(' ');

  return `${date.replace(/-/g, '.')} ${time.slice(0, 5)}`.trim();
};

/**
 * 수정이력 응답을 아코디언 항목으로 묶는다 (COM_공통정의_003 8).
 *
 * API 는 변경된 속성마다 한 행이라, 한 번의 수정(=같은 적용일시)이 여러 행으로 나뉜다.
 * 화면은 수정 단위로 접히므로 적용일시 기준으로 모으고 최신순으로 정렬한다.
 */
const toHistoryEntries = (items: ManualHistoryItem[]): ReviewHistoryEntry[] => {
  const grouped = new Map<string, ReviewHistoryEntry>();

  items.forEach((item, index) => {
    const key = `${item.aplyDttm}|${item.rgsrNm}`;
    const change = `${HISTORY_COLUMN_LABEL[item.chngClmnId] ?? item.chngClmnId} : ${toHistoryValue(item.chngBefoVal)} → ${toHistoryValue(item.chngAftrVal)}`;
    const entry = grouped.get(key);

    if (entry) {
      entry.changes.push(change);
      return;
    }

    grouped.set(key, {
      id: index,
      changedAt: toHistoryValue(item.aplyDttm),
      // TODO: 목록 API 가 수정자 사번을 주지 않아 이름만 노출한다(스펙은 '이름(사번)').
      editor: item.rgsrNm,
      changes: [change],
    });
  });

  return [...grouped.values()].sort((a, b) => b.changedAt.localeCompare(a.changedAt));
};

function HistoryRow({ entry }: { entry: ReviewHistoryEntry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box sx={{ borderBottom: `1px solid ${DIVIDER}` }}>
      <Box
        onClick={() => setExpanded((v) => !v)}
        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.5, cursor: 'pointer' }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: DARK }}>{entry.changedAt}</Typography>
        <Typography sx={{ fontSize: 14, color: SECONDARY, flex: 1 }}>{entry.editor}</Typography>
        {expanded
          ? <KeyboardArrowUpIcon sx={{ fontSize: 20, color: SECONDARY }} />
          : <KeyboardArrowDownIcon sx={{ fontSize: 20, color: SECONDARY }} />}
      </Box>
      {expanded && (
        <Box sx={{ pb: 1.5, pl: 0.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {entry.changes.map((change) => (
            <Typography key={change} sx={{ fontSize: 14, color: DARK }}>• {change}</Typography>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default function DocumentDetailDialog({
  open,
  title,
  row,
  onClose,
  onDeleted,
  onDownload,
}: Props) {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState<OperationForm | null>(null);
  /** 변경 여부 판정 기준 — 상세 조회 결과로 갱신된다 */
  const [baseline, setBaseline] = useState<OperationForm | null>(null);
  const [confirm, setConfirm] = useState<'leave' | 'save' | 'delete' | 'restricted' | null>(null);
  const [toast, setToast] = useState<{ message: string; severity: DocumentToastSeverity }>({
    message: '',
    severity: 'success',
  });

  // 팝업이 열릴 때 상세를 조회한다. 목록에 없는 파일 URL·사번·수정 정보가 여기서 온다.
  const {
    data: detail,
    isError: isDetailError,
    error: detailError,
    refetch: refetchDetail,
  } = useQuery(
    ['nab', 'counsel-backoffice', 'manual-detail', row?.id],
    async () => {
      const response = await getManualDetail({ nabCuslManlDcmtId: row!.id });

      if (response.error) {
        throw new Error(response.error.message ?? '문서 상세 조회에 실패했습니다.');
      }

      return response.data ?? null;
    },
    { enabled: open && row !== null },
  );

  // 다른 행을 열 때만 초기화한다. 탭 전환으로는 입력값이 사라지지 않는다 (2-A).
  useEffect(() => {
    if (open && row) {
      setTab(0);
      // 상세 도착 전에는 목록 값으로 채워 둔다
      setForm(initialForm(row));
      setBaseline(initialForm(row));
      setConfirm(null);
    }
  }, [open, row?.id]);

  // 상세가 도착하면 서버 값으로 다시 맞춘다 (사용자가 아직 만지기 전이다)
  useEffect(() => {
    if (detail) {
      setForm(detailToForm(detail));
      setBaseline(detailToForm(detail));
    }
  }, [detail]);

  // 분류 후보는 문서의 관리주체 하위로 좁힌다. 상세 도착 전에는 비워 둔다.
  const classOptions = detail?.nabCuslAdmrTypeCode
    ? MANUAL_CLASS_BY_ADMIN_TYPE[detail.nabCuslAdmrTypeCode]
    : [];

  // 쓰기 API 는 작업자 사번을 요청 본문 emnb 필드로 받는다
  const { user } = useAuthContext();
  const effectiveUser = user;
  const emnb = effectiveUser?.emnb ?? '';

  const queryClient = useQueryClient();

  /** 목록·상세를 다시 읽어 화면을 최신화한다 */
  const invalidateDocuments = () => {
    queryClient.invalidateQueries(['nab', 'counsel-backoffice', 'manual-list']);
    queryClient.invalidateQueries(['nab', 'counsel-backoffice', 'manual-detail']);
    queryClient.invalidateQueries(['nab', 'counsel-backoffice', 'manual-history']);
  };

  /** 변경내용 저장 — 적용기간(반영/종료일시)을 수정한다 */
  const saveMutation = useMutation(
    async () => {
      if (!row || !form) {
        throw new Error(DOCUMENT_DETAIL_TOASTS.saveFail);
      }

      if (!form.classCode) {
        throw new Error('분류를 선택해주세요.');
      }

      const response = await updateManual({
        nabCuslManlDcmtId: row.id,
        manlClsfCode: form.classCode,
        valdStarDttm: toApiDateTime(form.effectiveDate, form.effectiveTime),
        // 종료일자 미지정은 '무기한'이라 null 을 명시적으로 보낸다
        valdEndDttm: form.noEndDate ? null : toApiDateTime(form.endDate, form.endTime),
      }, emnb);

      if (response.error) {
        throw new Error(response.error.message ?? DOCUMENT_DETAIL_TOASTS.saveFail);
      }
    },
    {
      // 성공 : 변경내용·수정일자 갱신, 모달 닫힘, Toast (10-B)
      onSuccess: () => {
        setToast({ message: DOCUMENT_DETAIL_TOASTS.saveSuccess, severity: 'success' });
        invalidateDocuments();
        onClose();
      },
      // 실패 : 모달 유지, Toast
      onError: (error) => {
        setToast({
          message: (error as Error)?.message || DOCUMENT_DETAIL_TOASTS.saveFail,
          severity: 'error',
        });
      },
    },
  );

  /** 문서 삭제 — 소프트삭제(다건 API를 1건으로 호출) */
  const deleteMutation = useMutation(
    async () => {
      if (!row) {
        throw new Error(DOCUMENT_DETAIL_TOASTS.deleteFail);
      }

      const response = await deleteManual({ nabCuslManlDcmtIdList: [row.id] }, emnb);

      if (response.error) {
        throw new Error(response.error.message ?? DOCUMENT_DETAIL_TOASTS.deleteFail);
      }

      // 색인 삭제에 실패한 문서는 failedList 로 돌아오고 목록에 그대로 남는다
      if (response.data?.failedList?.includes(row.id)) {
        throw new Error(DOCUMENT_DETAIL_TOASTS.deleteFail);
      }
    },
    {
      // 성공 : 삭제 후 모달 닫힘, Toast, 목록 갱신 (10-C)
      onSuccess: () => {
        setToast({ message: DOCUMENT_DETAIL_TOASTS.deleteSuccess, severity: 'success' });
        invalidateDocuments();
        if (row) onDeleted?.(row);
        onClose();
      },
      // 실패 : 모달 유지, Toast
      onError: (error) => {
        setToast({
          message: (error as Error)?.message || DOCUMENT_DETAIL_TOASTS.deleteFail,
          severity: 'error',
        });
      },
    },
  );

  const isMutating = saveMutation.isLoading || deleteMutation.isLoading;

  // 수정 이력 — 팝업이 열릴 때 한 번 읽는다(탭 전환으로는 재조회하지 않는다, 2-A)
  const {
    data: historyItems,
    isFetching: isHistoryLoading,
    isError: isHistoryError,
  } = useQuery(
    ['nab', 'counsel-backoffice', 'manual-history', row?.id],
    async () => {
      const response = await getManualHistoryList({ nabCuslManlDcmtId: row!.id });

      if (response.error) {
        throw new Error(response.error.message ?? '수정 이력 조회에 실패했습니다.');
      }

      return response.data?.historyList ?? [];
    },
    { enabled: open && row !== null },
  );

  const history = useMemo(() => toHistoryEntries(historyItems ?? []), [historyItems]);

  // 팝업이 닫힌 뒤에도 토스트는 남아야 해서, 본문만 조건부로 렌더한다.
  if (!row || !form || !baseline) {
    return (
      <DocumentToast
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, message: '' }))}
      />
    );
  }

  const isDirty = (Object.keys(baseline) as (keyof OperationForm)[]).some(
    (key) => form[key] !== baseline[key],
  );

  // 상세가 오면 그 값을, 아직이면 목록 값을 보여준다
  const documentName = detail?.manlNm ?? row.documentName;
  /** 상세에 다운로드 URL 이 없으면 받을 파일이 없다 → 버튼 비활성 */
  const fileUrl = detail?.fileUrlPathNm ?? '';
  const canDownload = fileUrl !== '';
  const registrant = detail ? toPersonLabel(detail.rgsrNm, detail.rgsrEmnb) : row.registrantName;
  const registrantDept = detail?.rgstOrgnNm ?? row.registrantDept;
  const registeredAt = detail ? toFormDate(detail.rgstDttm, row.registeredAt) : row.registeredAt;
  const lastChanger = detail ? toPersonLabel(detail.lastChnrNm, detail.lastChnrEmnb) : row.registrantName;
  const lastChangerDept = detail?.lastChnrOrgnNm ?? row.registrantDept;
  const lastChangedAt = detail ? toFormDate(detail.lastChngDttm, row.registeredAt) : row.registeredAt;

  const update = <K extends keyof OperationForm>(key: K, value: OperationForm[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  /** 닫기 — 변경사항이 있으면 확인 모달을 먼저 띄운다 (1-B, 10-A) */
  const handleClose = () => {
    if (isDirty) {
      setConfirm('leave');
      return;
    }
    onClose();
  };

  /** 저장·삭제는 작업 제한 시간에 막힌다 (10-E) */
  const guardRestricted = (next: 'save' | 'delete') => {
    setConfirm(isRestrictedWorkTime() ? 'restricted' : next);
  };

  const handleSaveClick = () => {
    // 바뀐 게 없으면 저장할 것도 없다 — 안내만 남기고 확인 모달 없이 닫는다.
    // (팝업이 닫혀도 토스트는 본문 밖에서 렌더돼 그대로 보인다)
    if (!isDirty) {
      setToast({ message: DOCUMENT_DETAIL_TOASTS.noChanges, severity: 'error' });
      onClose();
      return;
    }
    guardRestricted('save');
  };

  /**
   * 문서 다운로드 (9-B) — 모달을 닫은 뒤 상세에서 받은 URL 을 연다.
   * fileUrlPathNm 은 조회 시점에 발급되는 만료형 주소라 저장하지 않고 그때그때 쓴다.
   */
  const handleDownload = () => {
    const url = detail?.fileUrlPathNm;
    if (!url) {
      return;
    }

    onClose();
    onDownload?.(row);
    window.open(url, '_blank', 'noopener');
  };

  const confirmProps = {
    leave: DOCUMENT_ALERTS.detailLeaveConfirm,
    save: DOCUMENT_ALERTS.detailSaveConfirm,
    delete: DOCUMENT_ALERTS.detailDeleteConfirm,
    restricted: DOCUMENT_ALERTS.restrictedTime,
  };

  const handleConfirm = () => {
    if (confirm === 'leave') {
      // 변경 내용을 초기화한 후 닫는다
      setForm(baseline);
      setConfirm(null);
      onClose();
      return;
    }

    if (confirm === 'save') {
      setConfirm(null);
      saveMutation.mutate();
      return;
    }

    if (confirm === 'delete') {
      setConfirm(null);
      deleteMutation.mutate();
      return;
    }

    setConfirm(null);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            width: 720,
            maxWidth: 720,
            boxShadow: '-40px 40px 80px -8px rgba(0,0,0,0.24)',
          },
        }}
      >
        {/* 1. 헤더 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 3 }}>
          <Typography sx={{ flex: 1, fontSize: 18, fontWeight: 700, color: DARK }}>{title}</Typography>
          <IconButton size="small" onClick={handleClose} sx={{ width: 28, height: 28 }}>
            <CloseIcon sx={{ fontSize: 18, color: SECONDARY }} />
          </IconButton>
        </Box>

        {/* 2. 탭 — 좌우 구분선 사이에 탭이 끼워지는 형태(선택 탭만 위로 솟는다) */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Box sx={{ width: 24, height: '1.5px', bgcolor: SECONDARY_16, flexShrink: 0 }} />
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              minHeight: 60,
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTab-root': {
                width: 200,
                minWidth: 130,
                height: 60,
                minHeight: 48,
                px: 5,
                fontSize: 16,
                fontWeight: 400,
                color: SECONDARY,
                borderBottom: `1.5px solid ${SECONDARY_16}`,
              },
              '& .Mui-selected': {
                color: `${PRIMARY_ORANGE} !important`,
                bgcolor: POPUP_BG,
                borderRadius: '8px 8px 0 0',
                border: `1.5px solid ${SECONDARY_16}`,
                borderBottom: 'none',
              },
            }}
          >
            <Tab label="기본 정보" />
            <Tab label="수정 이력" />
          </Tabs>
          <Box sx={{ flex: 1, height: '1.5px', bgcolor: SECONDARY_16 }} />
        </Box>

        {/* 상세 조회 실패 — 목록 값만 보이는 상태라 재시도 경로를 준다 */}
        {isDetailError && (
          <Alert
            severity="error"
            sx={{ borderRadius: 0 }}
            action={
              <Button color="inherit" size="small" onClick={() => refetchDetail()}>
                재시도
              </Button>
            }
          >
            {(detailError as Error)?.message ?? '문서 상세를 불러오지 못했습니다.'}
          </Alert>
        )}

        {/* 본문 — 두 탭 모두 마운트해 두고 감춘다(입력값 유지, 재조회 없음) */}
        <Box sx={{ position: 'relative', px: 3, py: 3, maxHeight: 'min(640px, calc(100vh - 260px))', overflow: 'auto', bgcolor: POPUP_BG }}>
          <Box sx={{ display: tab === 0 ? 'flex' : 'none', flexDirection: 'column', gap: 3 }}>
            {/* 3. 문서기본 정보 */}
            <Box sx={{ ...sectionSx, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="문서번호"
                  value={row.no.toLocaleString()}
                  disabled
                  InputLabelProps={{ shrink: true }}
                  sx={readOnlyFieldSx}
                />
                <FormControl sx={{ flex: 1, ...FIELD_SX }}>
                  <InputLabel shrink sx={labelSmallSx}>운영상태</InputLabel>
                  <Select
                    value={form.operationStatus}
                    label="운영상태"
                    onChange={(e) => update('operationStatus', e.target.value as OperationStatus)}
                    sx={selectFieldSx}
                  >
                    {OPERATION_STATUS_OPTIONS.map((opt) => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  label="반영일자"
                  type="date"
                  value={form.effectiveDate}
                  onChange={(e) => update('effectiveDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ ...FIELD_SX, flex: 1 }}
                />
                <FormControl sx={{ flex: 1, ...FIELD_SX }}>
                  <InputLabel shrink sx={labelSmallSx}>반영일시</InputLabel>
                  <Select
                    value={form.effectiveTime}
                    label="반영일시"
                    onChange={(e) => update('effectiveTime', e.target.value)}
                    sx={selectFieldSx}
                  >
                    {TIME_OPTIONS.map((opt) => (<MenuItem key={opt} value={opt}>{opt}</MenuItem>))}
                  </Select>
                </FormControl>
                {/* 종료일자 미지정을 해제해야 종료일자 필드가 나온다 (3-E) */}
                {!form.noEndDate && (
                  <>
                    <Typography sx={{ fontSize: 12, color: SECONDARY, flexShrink: 0 }}>~</Typography>
                    <TextField
                      label="종료일자"
                      type="date"
                      value={form.endDate}
                      onChange={(e) => update('endDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{ ...FIELD_SX, flex: 1 }}
                    />
                    <FormControl sx={{ flex: 1, ...FIELD_SX }}>
                      <InputLabel shrink sx={labelSmallSx}>종료일시</InputLabel>
                      <Select
                        value={form.endTime}
                        label="종료일시"
                        onChange={(e) => update('endTime', e.target.value)}
                        sx={selectFieldSx}
                      >
                        {TIME_OPTIONS.map((opt) => (<MenuItem key={opt} value={opt}>{opt}</MenuItem>))}
                      </Select>
                    </FormControl>
                  </>
                )}
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.noEndDate}
                    onChange={(e) => update('noEndDate', e.target.checked)}
                    sx={{ color: 'var(--nab-text-disabled)', '&.Mui-checked': { color: DARK } }}
                  />
                }
                label={<Typography sx={{ fontSize: 14, color: DARK }}>종료일자 미지정</Typography>}
                sx={{ m: 0, alignSelf: 'flex-start' }}
              />
            </Box>

            {/* 5. 등록문서 정보 — 분류는 문서 속성이라 문서명과 같은 카드에 둔다 (Figma 8433:236662) */}
            <Box sx={{ ...sectionSx, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* 분류 — 문서의 관리주체 하위 값만 고를 수 있다. 바꾸면 수정이력에 남는다 */}
              <FormControl sx={{ ...FIELD_SX }}>
                <InputLabel shrink sx={labelSmallSx}>분류</InputLabel>
                <Select
                  value={form.classCode}
                  label="분류"
                  displayEmpty
                  onChange={(e) => update('classCode', e.target.value as ManualClassCode)}
                  sx={selectFieldSx}
                >
                  {/* 분류 도입 이전 등록분은 값이 없다 — 고를 수는 없고 표시만 한다 */}
                  <MenuItem value="" disabled>미지정</MenuItem>
                  {classOptions.map((code) => (
                    <MenuItem key={code} value={code}>{MANUAL_CLASS_LABEL[code]}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={labelSx}>문서명</Typography>
                <Typography sx={strongValueSx}>{documentName}</Typography>
              </Box>
            </Box>

            {/* 6. 등록 정보 */}
            <Box sx={sectionSx}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={infoColumnSx}>
                  <Typography sx={labelSx}>등록자</Typography>
                  <Typography sx={valueSx}>{registrant}</Typography>
                </Box>
                <Box sx={infoColumnSx}>
                  <Typography sx={labelSx}>등록자 소속</Typography>
                  <Typography sx={valueSx}>{registrantDept}</Typography>
                </Box>
                <Box sx={lastInfoColumnSx}>
                  <Typography sx={labelSx}>등록일자</Typography>
                  <Typography sx={valueSx}>{registeredAt}</Typography>
                </Box>
              </Box>
            </Box>

            {/* 7. 수정 정보 */}
            <Box sx={sectionSx}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={infoColumnSx}>
                  <Typography sx={labelSx}>마지막 수정자</Typography>
                  <Typography sx={valueSx}>{lastChanger}</Typography>
                </Box>
                <Box sx={infoColumnSx}>
                  <Typography sx={labelSx}>마지막 수정자 소속</Typography>
                  <Typography sx={valueSx}>{lastChangerDept}</Typography>
                </Box>
                <Box sx={lastInfoColumnSx}>
                  <Typography sx={labelSx}>마지막 수정일자</Typography>
                  <Typography sx={valueSx}>{lastChangedAt}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* 8. 수정 이력 — 변경일시 내림차순 아코디언 */}
          <Box sx={{ display: tab === 1 ? 'block' : 'none' }}>
            <Box sx={sectionSx}>
              {!isHistoryLoading && isHistoryError && (
                <Typography sx={{ py: 5, textAlign: 'center', fontSize: 14, color: SECONDARY }}>
                  수정 이력을 불러오지 못했습니다.
                </Typography>
              )}

              {!isHistoryLoading && !isHistoryError && history.length === 0 && (
                <Typography sx={{ py: 5, textAlign: 'center', fontSize: 14, color: SECONDARY }}>
                  수정 이력이 없습니다.
                </Typography>
              )}

              {!isHistoryLoading && !isHistoryError && history.map((entry) => (
                <HistoryRow key={entry.id} entry={entry} />
              ))}
            </Box>
          </Box>
        </Box>

        {/* 9. 모달 버튼 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 3, borderTop: `1px solid ${DIVIDER}` }}>
          <Button
            variant="text"
            disabled={isMutating}
            onClick={() => guardRestricted('delete')}
            sx={{
              ...actionButtonSx,
              color: 'var(--nab-label-red-fg)',
              bgcolor: 'var(--nab-label-red-bg)',
              '&:hover': { bgcolor: 'var(--nab-label-red-bg)' },
              '&.Mui-disabled': { bgcolor: 'var(--nab-fill-16)', color: DISABLED },
            }}
          >
            {deleteMutation.isLoading ? '삭제 중…' : '문서 삭제'}
          </Button>
          <Box sx={{ flex: 1 }} />
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              disabled={!canDownload || isMutating}
              onClick={handleDownload}
              sx={{
                ...actionButtonSx,
                color: DARK,
                borderColor: 'var(--nab-border-strong)',
                '&:hover': { borderColor: SECONDARY, bgcolor: 'transparent' },
                '&.Mui-disabled': { color: DISABLED, borderColor: 'var(--nab-border)' },
              }}
            >
              문서 다운로드
            </Button>
            <Button
              variant="contained"
              disabled={isMutating}
              onClick={handleSaveClick}
              sx={{
                ...actionButtonSx,
                bgcolor: 'var(--nab-button)',
                color: 'white',
                boxShadow: 'none',
                '&:hover': { bgcolor: 'var(--nab-button-hover)', boxShadow: 'none' },
                '&.Mui-disabled': { bgcolor: 'var(--nab-fill-16)', color: DISABLED },
              }}
            >
              {saveMutation.isLoading ? '저장 중…' : '변경내용 저장'}
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* 10. 관련 모달 — 닫기/저장/삭제 확인, 작업 제한 시간 안내 */}
      <DocumentAlertDialog
        open={confirm !== null}
        title={confirm ? confirmProps[confirm].title : ''}
        message={confirm ? confirmProps[confirm].message : ''}
        confirmLabel={confirm ? confirmProps[confirm].confirmLabel : ''}
        cancelLabel={confirm && confirm !== 'restricted' ? confirmProps[confirm].cancelLabel : undefined}
        danger={confirm === 'delete'}
        onConfirm={handleConfirm}
        onClose={() => setConfirm(null)}
      />

      <DocumentToast
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, message: '' }))}
      />
    </>
  );
}
