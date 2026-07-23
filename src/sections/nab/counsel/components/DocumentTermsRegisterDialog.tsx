import { useRef, useState } from 'react';
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

interface Props {
  open: boolean;
  onClose: () => void;
  /** 등록 확정 콜백 (미지정 시 등록 동작 없음 — 후속 작업에서 연결) */
  onSubmit?: (files: { pdf: File; csv: File }) => void;
}

interface FileSlotProps {
  /** 파일 미첨부 시 안내 문구 */
  emptyText: string;
  file: File | null;
  onRemove: () => void;
}

/** 파일명 헤더 + 단일 파일 행/빈 안내 (약관 PDF·CSV 공용) */
function FileSlot({ emptyText, file, onRemove }: FileSlotProps) {
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
  // 약관 PDF/CSV 파일명 불일치 배너. 현재는 UI만 — 검증 트리거는 후속 작업에서 연결.
  const [mismatchError, setMismatchError] = useState(false);
  const pdfRef = useRef<HTMLInputElement>(null);
  const csvRef = useRef<HTMLInputElement>(null);

  const canSubmit = pdfFile !== null && csvFile !== null;

  const handleSubmit = () => {
    if (!pdfFile || !csvFile) {
      return;
    }
    onSubmit?.({ pdf: pdfFile, csv: csvFile });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, width: 720, maxWidth: 720 } }}
    >
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 3 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: DARK }}>보험약관 문서 등록</Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon sx={{ fontSize: 20, color: SECONDARY }} />
        </IconButton>
      </Box>

      {/* 본문 */}
      <Box sx={{ px: 3, pb: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography sx={{ fontSize: 14, color: DARK }}>
          약관 문서는 별도 반영일 지정 없이 AI 서비스에 반영됩니다.
        </Typography>

        {/* 파일명 불일치 에러 배너 (조건부) */}
        {mismatchError && (
          <Box
            sx={{
              display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.5, borderRadius: 2,
              bgcolor: 'var(--nab-label-red-bg)',
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 18, color: 'var(--nab-label-red-fg)' }} />
            <Typography sx={{ flex: 1, fontSize: 14, fontWeight: 700, color: 'var(--nab-label-red-fg)' }}>
              등록하려는 약관 PDF와 CSV 파일이 일치하지 않습니다. 파일명을 확인한 후 다시 등록해 주세요.
            </Typography>
            <IconButton size="small" onClick={() => setMismatchError(false)}>
              <CloseIcon sx={{ fontSize: 16, color: 'var(--nab-label-red-fg)' }} />
            </IconButton>
          </Box>
        )}

        {/* 약관 PDF */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FileSlot
            emptyText="약관 PDF 파일을 직접 첨부해 주세요"
            file={pdfFile}
            onRemove={() => setPdfFile(null)}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <input ref={pdfRef} type="file" hidden accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)} />
            <Button variant="contained" onClick={() => pdfRef.current?.click()} sx={attachButtonSx}>
              PDF 파일 첨부
            </Button>
          </Box>
        </Box>

        {/* 약관 CSV */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FileSlot
            emptyText="약관 CSV 파일을 직접 첨부해 주세요"
            file={csvFile}
            onRemove={() => setCsvFile(null)}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <input ref={csvRef} type="file" hidden accept=".csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)} />
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
          disabled={!canSubmit}
          onClick={handleSubmit}
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
  );
}
