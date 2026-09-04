import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { DARK, DISABLED, DIVIDER, SECONDARY } from '../../_lib/tokens';
import {
  DOCUMENT_ALERTS,
  TERMS_FILENAME_MISMATCH_MESSAGE,
  TERMS_REGISTER_TOASTS,
} from '../constant';
import { MAX_ATTACHMENT_SIZE, isRestrictedWorkTime, toBaseName } from '../lib/document-attachment';
import { saveStipulation } from '../../../../api/nab/counsel-backoffice';
import DocumentAlertDialog from './DocumentAlertDialog';
import DocumentToast from './DocumentToast';
import type { DocumentToastSeverity } from './DocumentToast';
import { useAuthContext } from 'src/auth/hooks';

/**
 * 보험약관 문서 등록 모달 (Figma COM_공통정의_006).
 *
 * 첨부·등록·닫기 과정에서 나오는 안내 모달 5종을 여기서 띄운다.
 * MOD_파일형식_001 / MOD_용량초과_001 / MOD_첨부오류_001 / MOD_문서등록_001 / MOD_등록이탈_001
 */

interface Props {
  open: boolean;
  onClose: () => void;
  /** 등록 확정 콜백 (미지정 시 등록 동작 없음 — 등록 API 연동에서 연결) */
  onSubmit?: (files: { pdf: File; csv: File }) => void;
}

/** 첨부 슬롯 구분 — 지원 확장자가 다르다 */
type FileSlot = 'pdf' | 'csv';

/** 이 모달이 띄우는 안내 모달 종류 */
type AlertKey = 'fileFormat' | 'fileSize' | 'fileError' | 'registerConfirm' | 'leaveConfirm' | 'restrictedTime';

const ALERT_PRESET: Record<AlertKey, { title: string; message: string; confirmLabel: string; cancelLabel?: string }> = {
  fileFormat: DOCUMENT_ALERTS.fileFormat,
  fileSize: DOCUMENT_ALERTS.fileSize,
  fileError: DOCUMENT_ALERTS.fileError,
  registerConfirm: DOCUMENT_ALERTS.registerConfirm,
  leaveConfirm: DOCUMENT_ALERTS.leaveConfirm,
  restrictedTime: DOCUMENT_ALERTS.restrictedTime,
};

interface FileSlotProps {
  /** 파일 미첨부 시 안내 문구 */
  emptyText: string;
  file: File | null;
  onRemove: () => void;
}

/** 파일명 헤더 + 단일 파일 행/빈 안내 (약관 PDF·CSV 공용) */
function FileSlotBox({ emptyText, file, onRemove }: FileSlotProps) {
  return (
    <Box sx={{ border: `1px solid ${DIVIDER}`, borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'var(--nab-header-bg)', py: 2, textAlign: 'center' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: SECONDARY }}>파일명</Typography>
      </Box>
      {file ? (
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, borderTop: `1px solid ${DIVIDER}` }}>
          <Typography sx={{ flex: 1, fontSize: 14, color: DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {file.name}
          </Typography>
          <IconButton size="small" onClick={onRemove}>
            <CancelIcon sx={{ fontSize: 18, color: SECONDARY }} />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ px: 5, py: 3.5, textAlign: 'center', borderTop: `1px dashed var(--nab-border)` }}>
          <Typography sx={{ fontSize: 14, color: DISABLED }}>{emptyText}</Typography>
        </Box>
      )}
    </Box>
  );
}

const attachButtonSx = {
  height: 36, px: 1.5, borderRadius: 1, fontSize: 14, fontWeight: 400,
  color: DARK, bgcolor: 'rgba(140,149,157,0.16)', boxShadow: 'none',
  '&:hover': { bgcolor: 'rgba(140,149,157,0.28)', boxShadow: 'none' },
} as const;

export default function DocumentTermsRegisterDialog({ open, onClose, onSubmit }: Props) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  /** 약관 PDF/CSV 파일명 불일치 배너 (7. 유효성 검사) */
  const [mismatchError, setMismatchError] = useState(false);
  const [alert, setAlert] = useState<AlertKey | null>(null);
  const [toast, setToast] = useState<{ message: string; severity: DocumentToastSeverity }>({
    message: '',
    severity: 'error',
  });
  const pdfRef = useRef<HTMLInputElement>(null);
  const csvRef = useRef<HTMLInputElement>(null);

  // 첨부 완료된 파일이 1건 이상이면 활성 (6-A). 두 파일이 다 있는지는 유효성 검사에서 본다.
  const canSubmit = pdfFile !== null || csvFile !== null;
  const isDirty = pdfFile !== null || csvFile !== null;

  // 쓰기 API 는 작업자 사번을 요청 본문 emnb 필드로 받는다
  const { user } = useAuthContext();
  const effectiveUser = user;
  const emnb = effectiveUser?.emnb ?? '';

  const queryClient = useQueryClient();

  /** 문서 등록 — 약관은 PDF·CSV 를 한 쌍으로 올린다 */
  const saveMutation = useMutation(
    async ({ pdf, csv }: { pdf: File; csv: File }) => {
      const response = await saveStipulation({ pdfFile: pdf, csvFile: csv }, emnb);

      if (response.error) {
        throw new Error(response.error.message ?? TERMS_REGISTER_TOASTS.saveFail);
      }
    },
    {
      onSuccess: () => {
        setToast({ message: TERMS_REGISTER_TOASTS.saveSuccess, severity: 'success' });
        queryClient.invalidateQueries(['nab', 'counsel-backoffice', 'stipulation-list']);
        resetFiles();
        onClose();
      },
      // 실패 시 모달을 유지해 첨부한 파일을 다시 쓸 수 있게 한다
      onError: (error) => {
        setToast({
          message: (error as Error)?.message || TERMS_REGISTER_TOASTS.saveFail,
          severity: 'error',
        });
      },
    },
  );

  const resetFiles = () => {
    setPdfFile(null);
    setCsvFile(null);
    setMismatchError(false);
  };

  const setFile = (slot: FileSlot, file: File | null) => {
    if (slot === 'pdf') {
      setPdfFile(file);
    } else {
      setCsvFile(file);
    }
    setMismatchError(false);
  };

  /**
   * 파일 첨부 — 확장자·용량을 검사하고 통과한 것만 담는다 (3-A, 5-A).
   * 같은 파일을 다시 고를 수 있도록 input value 는 매번 비운다.
   */
  const handleFileChange = (slot: FileSlot, input: HTMLInputElement) => {
    const file = input.files?.[0] ?? null;
    input.value = '';

    if (!file) {
      return;
    }

    // 지원하지 않는 확장자 → MOD_파일형식_001
    if (!file.name.toLowerCase().endsWith(`.${slot}`)) {
      setAlert('fileFormat');
      return;
    }

    // 최대 허용 용량 초과 → MOD_용량초과_001
    if (file.size > MAX_ATTACHMENT_SIZE) {
      setAlert('fileSize');
      return;
    }

    try {
      // TODO: 업로드 API 연동 시 이 자리에서 업로드하고, 실패를 catch 로 받는다.
      setFile(slot, file);
    } catch {
      // 첨부 처리 중 오류 → MOD_첨부오류_001
      setAlert('fileError');
    }
  };

  /** 닫기 — 첨부한 파일이 있으면 확인 모달을 먼저 띄운다 (1-B) */
  const handleClose = () => {
    if (isDirty) {
      setAlert('leaveConfirm');
      return;
    }
    onClose();
  };

  /** 문서 등록 — 작업 제한 시간 확인 → 파일 유효성 검사 → 등록 확인 모달 (6-B) */
  const handleSubmitClick = () => {
    if (isRestrictedWorkTime()) {
      setAlert('restrictedTime');
      return;
    }

    // PDF·CSV 둘 다 등록됐는지
    if (!pdfFile || !csvFile) {
      setToast({ message: TERMS_REGISTER_TOASTS.missingFile, severity: 'error' });
      return;
    }

    // 두 파일명이 같은지
    if (toBaseName(pdfFile.name) !== toBaseName(csvFile.name)) {
      setMismatchError(true);
      return;
    }

    setAlert('registerConfirm');
  };

  const handleAlertConfirm = () => {
    if (alert === 'leaveConfirm') {
      setAlert(null);
      resetFiles();
      onClose();
      return;
    }

    if (alert === 'registerConfirm' && pdfFile && csvFile) {
      setAlert(null);
      onSubmit?.({ pdf: pdfFile, csv: csvFile });
      saveMutation.mutate({ pdf: pdfFile, csv: csvFile });
      return;
    }

    if (alert === 'fileError') {
      // '계속' — 오류 파일을 제외하고 나머지로 진행한다
      setAlert(null);
      return;
    }

    setAlert(null);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, width: 720, maxWidth: 720 } }}
      >
        {/* 헤더 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 3 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: DARK }}>보험약관 문서 등록</Typography>
          <IconButton size="small" onClick={handleClose}>
            <CloseIcon sx={{ fontSize: 20, color: SECONDARY }} />
          </IconButton>
        </Box>

        {/* 본문 */}
        <Box sx={{ px: 3, pb: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography sx={{ fontSize: 14, color: DARK }}>
            약관 문서는 별도 반영일 지정 없이 AI 서비스에 반영됩니다.
          </Typography>

          {/* 파일명 불일치 에러 배너 (유효성 검사 실패) */}
          {mismatchError && (
            <Box
              sx={{
                display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.5, borderRadius: 2,
                bgcolor: 'var(--nab-label-red-bg)',
              }}
            >
              <ErrorOutlineIcon sx={{ fontSize: 18, color: 'var(--nab-label-red-fg)' }} />
              <Typography sx={{ flex: 1, fontSize: 14, fontWeight: 700, color: 'var(--nab-label-red-fg)' }}>
                {TERMS_FILENAME_MISMATCH_MESSAGE}
              </Typography>
              <IconButton size="small" onClick={() => setMismatchError(false)}>
                <CloseIcon sx={{ fontSize: 16, color: 'var(--nab-label-red-fg)' }} />
              </IconButton>
            </Box>
          )}

          {/* 약관 PDF */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FileSlotBox
              emptyText="약관 PDF 파일을 직접 첨부해 주세요"
              file={pdfFile}
              onRemove={() => setFile('pdf', null)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <input
                ref={pdfRef}
                type="file"
                hidden
                accept=".pdf"
                onChange={(e) => handleFileChange('pdf', e.target)}
              />
              <Button variant="contained" onClick={() => pdfRef.current?.click()} sx={attachButtonSx}>
                PDF 파일 첨부
              </Button>
            </Box>
          </Box>

          {/* 약관 CSV */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FileSlotBox
              emptyText="약관 CSV 파일을 직접 첨부해 주세요"
              file={csvFile}
              onRemove={() => setFile('csv', null)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <input
                ref={csvRef}
                type="file"
                hidden
                accept=".csv"
                onChange={(e) => handleFileChange('csv', e.target)}
              />
              <Button variant="contained" onClick={() => csvRef.current?.click()} sx={attachButtonSx}>
                CSV 파일 첨부
              </Button>
            </Box>
          </Box>
        </Box>

        {/* 하단 액션 */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 3, py: 3, borderTop: `1px solid ${DIVIDER}` }}>
          <Button
            variant="contained"
            disabled={!canSubmit || saveMutation.isLoading}
            onClick={handleSubmitClick}
            sx={{
              height: 40, px: 2, borderRadius: 2, fontSize: 14, fontWeight: 500,
              bgcolor: 'var(--nab-button)', color: 'white', boxShadow: 'none',
              '&:hover': { bgcolor: 'var(--nab-button-hover)', boxShadow: 'none' },
              '&.Mui-disabled': { bgcolor: 'rgba(140,149,157,0.2)', color: 'rgba(140,149,157,0.64)' },
            }}
          >
            {saveMutation.isLoading ? '등록 중…' : '문서 등록'}
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
