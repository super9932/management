import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
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
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { DARK, DISABLED, DIVIDER, FIELD_SX, PRIMARY_ORANGE, SECONDARY } from '../../_lib/tokens';
import {
  DOCUMENT_ACCEPT,
  DOCUMENT_ALERTS,
  MANUAL_CLASS_BY_ADMIN_TYPE,
  MANUAL_CLASS_LABEL,
  MANUAL_REGISTER_TOASTS,
  TIME_OPTIONS,
  tomorrowInputDate,
} from '../constant';
import { checkAttachments, isRestrictedWorkTime, toApiDateTime } from '../lib/document-attachment';
import { saveManual } from '../../../../api/nab/counsel-backoffice';
import type { AdminTypeCode, ManualClassCode } from '../../../../api/nab/counsel-backoffice';
import DocumentAlertDialog from './DocumentAlertDialog';
import DocumentToast from './DocumentToast';
import type { DocumentToastSeverity } from './DocumentToast';
import { useAuthContext } from 'src/auth/hooks';

interface Props {
  open: boolean;
  /** 다이얼로그 제목 (예: '보험공통 문서 등록' | '보험심사 문서 등록') */
  title: string;
  /** 관리주체 — 등록 API 필수값 (UDW / ISRN_ADT / ISRN_SVC) */
  adminType: AdminTypeCode;
  onClose: () => void;
  /** 등록 확정 콜백 (미지정 시 등록 동작 없음 — 후속 작업에서 연결) */
  onSubmit?: (files: File[]) => void;
}

/** 이 모달이 띄우는 안내 모달 종류 (Figma COM_공통정의_006) */
type AlertKey = 'fileFormat' | 'fileSize' | 'fileError' | 'registerConfirm' | 'leaveConfirm' | 'restrictedTime';

const ALERT_PRESET: Record<AlertKey, { title: string; message: string; confirmLabel: string; cancelLabel?: string }> = {
  fileFormat: DOCUMENT_ALERTS.fileFormat,
  fileSize: DOCUMENT_ALERTS.fileSize,
  fileError: DOCUMENT_ALERTS.fileError,
  registerConfirm: DOCUMENT_ALERTS.registerConfirm,
  leaveConfirm: DOCUMENT_ALERTS.leaveConfirm,
  restrictedTime: DOCUMENT_ALERTS.restrictedTime,
};

/**
 * 반영/종료 일시 초기값 — 변경 여부(dirty) 판정 기준.
 *
 * 반영일자는 익일 00:00 부터만 고를 수 있어 기본값도 내일로 둔다(종료일자도 같은 날에서 시작).
 * 모듈 로드 시 한 번 계산하므로 자정을 넘겨 열어 둔 탭에서는 새로고침해야 갱신된다.
 */
const EARLIEST_DATE = tomorrowInputDate();

const INITIAL_SCHEDULE = {
  effectiveDate: EARLIEST_DATE,
  effectiveTime: '00:00',
  endDate: EARLIEST_DATE,
  endTime: '24:00',
  noEndDate: true,
} as const;

const selectFieldSx = {
  fontSize: 14,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: DIVIDER },
  borderRadius: 2,
  height: 54,
} as const;

const labelSx = { fontSize: 12, fontWeight: 700, color: SECONDARY } as const;

export default function DocumentRegisterDialog({ open, title, adminType, onClose, onSubmit }: Props) {
  const [effectiveDate, setEffectiveDate] = useState<string>(INITIAL_SCHEDULE.effectiveDate);
  const [effectiveTime, setEffectiveTime] = useState<string>(INITIAL_SCHEDULE.effectiveTime);
  const [endDate, setEndDate] = useState<string>(INITIAL_SCHEDULE.endDate);
  const [endTime, setEndTime] = useState<string>(INITIAL_SCHEDULE.endTime);
  const [noEndDate, setNoEndDate] = useState<boolean>(INITIAL_SCHEDULE.noEndDate);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  // 분류는 관리주체 하위 값이라 관리주체마다 후보가 다르다 (등록 API 필수값)
  const classOptions = MANUAL_CLASS_BY_ADMIN_TYPE[adminType];
  const [classCode, setClassCode] = useState<ManualClassCode>(classOptions[0]);
  const [alert, setAlert] = useState<AlertKey | null>(null);
  const [toast, setToast] = useState<{ message: string; severity: DocumentToastSeverity }>({
    message: '',
    severity: 'error',
  });
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * 파일 첨부 — 확장자·용량을 검사해 통과분만 담고, 위반이 있으면 안내 모달을 띄운다.
   * (지원 형식 외 → MOD_파일형식_001 / 용량 초과 → MOD_용량초과_001)
   */
  const addFiles = (list: FileList | null) => {
    if (!list || list.length === 0) {
      return;
    }

    const { accepted, hasInvalidExtension, hasOversize } = checkAttachments(Array.from(list));

    try {
      // TODO: 업로드 API 연동 시 이 자리에서 업로드하고, 실패를 catch 로 받는다.
      if (accepted.length > 0) {
        setFiles((prev) => [...prev, ...accepted]);
      }
    } catch {
      // 첨부 처리 중 오류 → MOD_첨부오류_001
      setAlert('fileError');
      return;
    }

    if (hasInvalidExtension) {
      setAlert('fileFormat');
      return;
    }
    if (hasOversize) {
      setAlert('fileSize');
    }
  };

  /** 반영일자 변경 — 종료일자가 그보다 앞서면 함께 끌어올린다 */
  const handleEffectiveDateChange = (value: string) => {
    setEffectiveDate(value);
    setEndDate((prev) => (prev < value ? value : prev));
  };

  const resetForm = () => {
    setFiles([]);
    setEffectiveDate(INITIAL_SCHEDULE.effectiveDate);
    setEffectiveTime(INITIAL_SCHEDULE.effectiveTime);
    setEndDate(INITIAL_SCHEDULE.endDate);
    setEndTime(INITIAL_SCHEDULE.endTime);
    setNoEndDate(INITIAL_SCHEDULE.noEndDate);
    setClassCode(classOptions[0]);
  };

  const handleRemove = (target: File) => {
    setFiles((prev) => prev.filter((file) => file !== target));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    addFiles(event.dataTransfer.files);
  };

  const hasFiles = files.length > 0;

  // 쓰기 API 는 작업자 사번을 요청 본문 emnb 필드로 받는다
  const { user } = useAuthContext();
  const effectiveUser = user;
  const emnb = effectiveUser?.emnb ?? '';

  const queryClient = useQueryClient();

  /**
   * 문서 등록 — 등록 API 는 파일 1건당 문서 1건이라 첨부한 수만큼 순차로 올린다.
   * 일부만 실패하면 실패 건수를 알리고 모달을 유지한다.
   */
  const saveMutation = useMutation(
    async () => {
      const meta = {
        nabCuslAdmrTypeCode: adminType,
        manlClsfCode: classCode,
        valdStarDttm: toApiDateTime(effectiveDate, effectiveTime),
        // 종료일자 미지정은 무기한이라 값을 빼고 보낸다
        ...(noEndDate ? {} : { valdEndDttm: toApiDateTime(endDate, endTime) }),
      };

      const failed: string[] = [];

      for (const file of files) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const response = await saveManual({ file, meta }, emnb);

          if (response.error) {
            failed.push(file.name);
          }
        } catch {
          failed.push(file.name);
        }
      }

      if (failed.length > 0) {
        throw new Error(
          failed.length === files.length
            ? MANUAL_REGISTER_TOASTS.saveFail
            : `${failed.length}건 등록에 실패했습니다. (${failed.join(', ')})`,
        );
      }
    },
    {
      onSuccess: () => {
        setToast({ message: MANUAL_REGISTER_TOASTS.saveSuccess, severity: 'success' });
        queryClient.invalidateQueries(['nab', 'counsel-backoffice', 'manual-list']);
        resetForm();
        onClose();
      },
      // 실패 시 모달을 유지해 첨부한 파일을 다시 쓸 수 있게 한다
      onError: (error) => {
        setToast({
          message: (error as Error)?.message || MANUAL_REGISTER_TOASTS.saveFail,
          severity: 'error',
        });
      },
    },
  );

  /** 첨부했거나 반영/종료 일시를 바꿨으면 변경 데이터가 있는 것으로 본다 */
  const isDirty =
    hasFiles
    || effectiveDate !== INITIAL_SCHEDULE.effectiveDate
    || effectiveTime !== INITIAL_SCHEDULE.effectiveTime
    || endDate !== INITIAL_SCHEDULE.endDate
    || endTime !== INITIAL_SCHEDULE.endTime
    || noEndDate !== INITIAL_SCHEDULE.noEndDate;

  /** 닫기 — 변경 데이터가 있으면 확인 모달을 먼저 띄운다 */
  const handleClose = () => {
    if (isDirty) {
      setAlert('leaveConfirm');
      return;
    }
    onClose();
  };

  /** 문서 등록 — 작업 제한 시간 확인 후 등록 확인 모달을 띄운다 */
  const handleSubmitClick = () => {
    if (isRestrictedWorkTime()) {
      setAlert('restrictedTime');
      return;
    }
    if (!hasFiles) {
      setToast({ message: MANUAL_REGISTER_TOASTS.missingFile, severity: 'error' });
      return;
    }
    setAlert('registerConfirm');
  };

  const handleAlertConfirm = () => {
    if (alert === 'leaveConfirm') {
      setAlert(null);
      resetForm();
      onClose();
      return;
    }

    if (alert === 'registerConfirm' && hasFiles) {
      setAlert(null);
      onSubmit?.(files);
      saveMutation.mutate();
      return;
    }

    // 첨부오류 '계속' — 오류 파일을 제외한 나머지로 진행한다
    setAlert(null);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: {
          borderRadius: 4, width: 720, maxWidth: 720,
          height: 750, maxHeight: 'calc(100% - 64px)',
          display: 'flex', flexDirection: 'column',
        } }}
      >
        {/* 헤더 (Fixed) */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 3, flexShrink: 0 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: DARK }}>{title}</Typography>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon sx={{ fontSize: 20, color: SECONDARY }} />
          </IconButton>
        </Box>

        {/* 본문 (상단 필드 Fixed, 파일 영역 scrollable) */}
        <Box sx={{ px: 3, pb: 3, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* 분류 — 관리주체 하위 값이라 후보가 관리주체별로 다르다 */}
          <FormControl sx={{ ...FIELD_SX }}>
            <InputLabel shrink sx={labelSx}>분류</InputLabel>
            <Select
              value={classCode}
              label="분류"
              onChange={(e) => setClassCode(e.target.value as ManualClassCode)}
              sx={selectFieldSx}
            >
              {classOptions.map((code) => (
                <MenuItem key={code} value={code}>{MANUAL_CLASS_LABEL[code]}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 반영/종료 일시 */}
          <Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                label="반영일자"
                type="date"
                value={effectiveDate}
                onChange={(e) => handleEffectiveDateChange(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: EARLIEST_DATE }}
                sx={{ ...FIELD_SX, width: noEndDate ? 332 : undefined, flex: noEndDate ? 'none' : 1 }}
              />
              <FormControl sx={{ flex: 1, ...FIELD_SX }}>
                <InputLabel shrink sx={labelSx}>반영시간</InputLabel>
                <Select value={effectiveTime} label="반영시간" onChange={(e) => setEffectiveTime(e.target.value)} sx={selectFieldSx}>
                  {TIME_OPTIONS.map((opt) => (<MenuItem key={opt} value={opt}>{opt}</MenuItem>))}
                </Select>
              </FormControl>
              {!noEndDate && (
                <>
                  <Typography sx={{ fontSize: 12, color: SECONDARY, flexShrink: 0 }}>~</Typography>
                  <TextField
                    label="종료일자"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: effectiveDate }}
                    sx={{ ...FIELD_SX, flex: 1 }}
                  />
                  <FormControl sx={{ flex: 1, ...FIELD_SX }}>
                    <InputLabel shrink sx={labelSx}>종료시간</InputLabel>
                    <Select value={endTime} label="종료시간" onChange={(e) => setEndTime(e.target.value)} sx={selectFieldSx}>
                      {TIME_OPTIONS.map((opt) => (<MenuItem key={opt} value={opt}>{opt}</MenuItem>))}
                    </Select>
                  </FormControl>
                </>
              )}
            </Box>
            {/* helper */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pl: 1.5, pt: 1 }}>
              <InfoOutlinedIcon sx={{ fontSize: 16, color: SECONDARY }} />
              <Typography sx={{ fontSize: 12, color: SECONDARY }}>
                문서 반영일자는 익일 00:00부터 선택할 수 있습니다.
              </Typography>
            </Box>
          </Box>

          {/* 종료일자 미지정 */}
          <FormControlLabel
            sx={{ m: 0 }}
            control={
              <Checkbox
                size="small"
                checked={noEndDate}
                onChange={(e) => setNoEndDate(e.target.checked)}
                sx={{ color: 'var(--nab-text-disabled)', '&.Mui-checked': { color: DARK } }}
              />
            }
            label={<Typography sx={{ fontSize: 14, color: DARK }}>종료일자 미지정</Typography>}
          />

          {/* 파일 첨부 테이블 (헤더 Fixed, 목록 scrollable) */}
          <Box
            sx={{
              border: `1px solid ${DIVIDER}`, borderRadius: 2, overflow: 'hidden',
              display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0,
            }}
          >
            <Box sx={{ bgcolor: 'var(--nab-header-bg)', py: 2, textAlign: 'center', flexShrink: 0 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: SECONDARY }}>파일명</Typography>
            </Box>
            {hasFiles ? (
              <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
                {files.map((file) => (
                  <Box
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, borderTop: `1px solid ${DIVIDER}` }}
                  >
                    <Typography sx={{ flex: 1, fontSize: 14, color: DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {file.name}
                    </Typography>
                    <IconButton size="small" onClick={() => handleRemove(file)}>
                      <CancelIcon sx={{ fontSize: 18, color: SECONDARY }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                sx={{
                  flex: 1, m: 1.5, px: 5,
                  border: `1px dashed ${dragOver ? PRIMARY_ORANGE : 'var(--nab-border)'}`,
                  borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textAlign: 'center', cursor: 'pointer',
                }}
              >
                <Typography sx={{ fontSize: 14, color: DISABLED, lineHeight: 1.6 }}>
                  첨부할 파일을 드래그하여 놓거나 클릭하여 첨부해 주세요.
                  <br />
                  지원 형식: PDF, CSV, DOCX
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* 하단 액션 (Fixed) */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, px: 3, py: 3, borderTop: `1px solid ${DIVIDER}`, flexShrink: 0 }}>
          <input
            ref={inputRef}
            type="file"
            hidden
            multiple
            accept={DOCUMENT_ACCEPT}
            onChange={(e) => addFiles(e.target.files)}
          />
          <Button
            variant="outlined"
            onClick={() => inputRef.current?.click()}
            sx={{
              height: 40, px: 2, borderRadius: 2, fontSize: 14, fontWeight: 400,
              color: DARK, borderColor: 'var(--nab-border-strong)',
              '&:hover': { borderColor: SECONDARY, bgcolor: 'transparent' },
            }}
          >
            파일 첨부
          </Button>
          <Button
            variant="contained"
            disabled={!hasFiles}
            onClick={handleSubmitClick}
            sx={{
              height: 40, px: 2, borderRadius: 2, fontSize: 14, fontWeight: 500,
              bgcolor: 'var(--nab-button)', color: 'white', boxShadow: 'none',
              '&:hover': { bgcolor: 'var(--nab-button-hover)', boxShadow: 'none' },
              '&.Mui-disabled': { bgcolor: 'rgba(140,149,157,0.2)', color: 'rgba(140,149,157,0.64)' },
            }}
          >
            문서 등록
          </Button>
        </Box>
      </Dialog>

      {/* 안내 모달 5종 + 작업 제한 시간 안내 */}
      <DocumentAlertDialog
        open={alert !== null}
        title={alert ? ALERT_PRESET[alert].title : ''}
        message={alert ? ALERT_PRESET[alert].message : ''}
        confirmLabel={alert ? ALERT_PRESET[alert].confirmLabel : ''}
        cancelLabel={alert ? ALERT_PRESET[alert].cancelLabel : undefined}
        onConfirm={handleAlertConfirm}
        onClose={() => setAlert(null)}
      />

      <DocumentToast
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, message: '' }))}
      />
    </>
  );
}
