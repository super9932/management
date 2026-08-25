import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  DARK,
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
  MOCK_REVIEW_HISTORY,
  OPERATION_STATUS_OPTIONS,
  RESTRICTED_WORK_HOUR_END,
  RESTRICTED_WORK_HOUR_START,
  TIME_OPTIONS,
} from '../constant';
import DocumentAlertDialog from './DocumentAlertDialog';
import type { OperationStatus, ReviewHistoryEntry } from '../type';

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
 * 목록이 내려주는 상태('오류'·'미운영')는 상세 드롭다운 옵션(운영중/대기중)에 없다.
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
  effectiveDate: toDatePart(row.effectiveStart, '2026.01.01'),
  effectiveTime: '00:00',
  endDate: toDatePart(row.effectiveEnd, '2027.12.31'),
  endTime: '24:00',
  // 종료일자 미지정은 최초 진입 시 선택 상태 (3-E)
  noEndDate: isBlankDate(row.effectiveEnd),
});

/** 서버 시간 기준 작업 제한 시간(23:00~24:00)인지 (10-E) */
const isRestrictedWorkTime = (): boolean => {
  const hour = new Date().getHours();

  return hour >= RESTRICTED_WORK_HOUR_START && hour < RESTRICTED_WORK_HOUR_END;
};

/** 수정 이력 정렬 — 변경일시 내림차순 (2-C) */
const sortHistoryDesc = (entries: ReviewHistoryEntry[]): ReviewHistoryEntry[] =>
  [...entries].sort((a, b) => b.changedAt.localeCompare(a.changedAt));

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
  const [confirm, setConfirm] = useState<'leave' | 'save' | 'delete' | 'restricted' | null>(null);
  const [toast, setToast] = useState('');

  // 다른 행을 열 때만 초기화한다. 탭 전환으로는 입력값이 사라지지 않는다 (2-A).
  useEffect(() => {
    if (open && row) {
      setTab(0);
      setForm(initialForm(row));
      setConfirm(null);
    }
  }, [open, row?.id]);

  const history = useMemo(() => sortHistoryDesc(MOCK_REVIEW_HISTORY), []);

  // 팝업이 닫힌 뒤에도 토스트는 남아야 해서, 본문만 조건부로 렌더한다.
  if (!row || !form) {
    return (
      <Snackbar
        open={toast !== ''}
        autoHideDuration={3000}
        onClose={() => setToast('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setToast('')}>
          {toast}
        </Alert>
      </Snackbar>
    );
  }

  const initial = initialForm(row);
  const isDirty = (Object.keys(initial) as (keyof OperationForm)[]).some(
    (key) => form[key] !== initial[key],
  );

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
    if (!isDirty) {
      setToast(DOCUMENT_DETAIL_TOASTS.noChanges);
      return;
    }
    guardRestricted('save');
  };

  const handleDownload = () => {
    // 모달을 닫은 뒤 다운로드한다 (9-B)
    onClose();
    onDownload?.(row);
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
      setForm(initialForm(row));
      setConfirm(null);
      onClose();
      return;
    }

    if (confirm === 'save') {
      // TODO: 저장 API 연동 — 성공/실패에 따라 토스트 문구가 갈린다
      // 성공 시 변경내용·수정일자 갱신 후 모달을 닫는다 (10-B)
      setConfirm(null);
      setToast(DOCUMENT_DETAIL_TOASTS.saveSuccess);
      onClose();
      return;
    }

    if (confirm === 'delete') {
      // TODO: 삭제 API 연동
      setConfirm(null);
      setToast(DOCUMENT_DETAIL_TOASTS.deleteSuccess);
      onDeleted?.(row);
      onClose();
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

        {/* 본문 — 두 탭 모두 마운트해 두고 감춘다(입력값 유지, 재조회 없음) */}
        <Box sx={{ px: 3, py: 3, maxHeight: 'min(640px, calc(100vh - 260px))', overflow: 'auto', bgcolor: POPUP_BG }}>
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
                  value={form.effectiveDate}
                  onChange={(e) => update('effectiveDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ endAdornment: (
                    <InputAdornment position="end">
                      <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: SECONDARY }} />
                    </InputAdornment>
                  ) }}
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
                      value={form.endDate}
                      onChange={(e) => update('endDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ endAdornment: (
                        <InputAdornment position="end">
                          <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: SECONDARY }} />
                        </InputAdornment>
                      ) }}
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

            {/* 5. 등록문서 정보 */}
            <Box sx={{ ...sectionSx, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={labelSx}>문서명</Typography>
                <Typography sx={strongValueSx}>{row.documentName}</Typography>
              </Box>
            </Box>

            {/* 6. 등록 정보 */}
            <Box sx={sectionSx}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={infoColumnSx}>
                  <Typography sx={labelSx}>등록자</Typography>
                  <Typography sx={valueSx}>{row.registrantName}</Typography>
                </Box>
                <Box sx={infoColumnSx}>
                  <Typography sx={labelSx}>등록자 소속</Typography>
                  <Typography sx={valueSx}>{row.registrantDept}</Typography>
                </Box>
                <Box sx={lastInfoColumnSx}>
                  <Typography sx={labelSx}>등록일자</Typography>
                  <Typography sx={valueSx}>{row.registeredAt}</Typography>
                </Box>
              </Box>
            </Box>

            {/* 7. 수정 정보 */}
            <Box sx={sectionSx}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={infoColumnSx}>
                  <Typography sx={labelSx}>마지막 수정자</Typography>
                  <Typography sx={valueSx}>{row.registrantName}</Typography>
                </Box>
                <Box sx={infoColumnSx}>
                  <Typography sx={labelSx}>마지막 수정자 소속</Typography>
                  <Typography sx={valueSx}>{row.registrantDept}</Typography>
                </Box>
                <Box sx={lastInfoColumnSx}>
                  <Typography sx={labelSx}>마지막 수정일자</Typography>
                  <Typography sx={valueSx}>{row.registeredAt}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* 8. 수정 이력 — 변경일시 내림차순 아코디언 */}
          <Box sx={{ display: tab === 1 ? 'block' : 'none' }}>
            <Box sx={sectionSx}>
              {history.map((entry) => (
                <HistoryRow key={entry.id} entry={entry} />
              ))}
            </Box>
          </Box>
        </Box>

        {/* 9. 모달 버튼 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 3, py: 3, borderTop: `1px solid ${DIVIDER}` }}>
          <Button
            variant="text"
            onClick={() => guardRestricted('delete')}
            sx={{
              ...actionButtonSx,
              color: 'var(--nab-label-red-fg)',
              bgcolor: 'var(--nab-label-red-bg)',
              '&:hover': { bgcolor: 'var(--nab-label-red-bg)' },
            }}
          >
            문서 삭제
          </Button>
          <Box sx={{ flex: 1 }} />
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              onClick={handleDownload}
              sx={{
                ...actionButtonSx,
                color: DARK,
                borderColor: 'var(--nab-border-strong)',
                '&:hover': { borderColor: SECONDARY, bgcolor: 'transparent' },
              }}
            >
              문서 다운로드
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveClick}
              sx={{
                ...actionButtonSx,
                bgcolor: 'var(--nab-button)',
                color: 'white',
                boxShadow: 'none',
                '&:hover': { bgcolor: 'var(--nab-button-hover)', boxShadow: 'none' },
              }}
            >
              변경내용 저장
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
        onConfirm={handleConfirm}
        onClose={() => setConfirm(null)}
      />

      <Snackbar
        open={toast !== ''}
        autoHideDuration={3000}
        onClose={() => setToast('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setToast('')}>
          {toast}
        </Alert>
      </Snackbar>
    </>
  );
}
