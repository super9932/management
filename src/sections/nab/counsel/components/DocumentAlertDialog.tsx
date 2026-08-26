import {
  Box,
  Button,
  Dialog,
  Typography,
} from '@mui/material';
import { DARK, SECONDARY } from '../../_lib/tokens';

interface Props {
  open: boolean;
  title: string;
  /** 본문 (개행은 \n — pre-line 으로 렌더) */
  message: string;
  confirmLabel: string;
  /** 없으면 단일 확인 버튼 */
  cancelLabel?: string;
  /** 파괴적 액션(문서 삭제 등) — 확인 버튼을 빨간색으로 */
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * 문서 등록 관련 공통 alert/confirm 다이얼로그.
 * 프리셋 문구는 constant 의 DOCUMENT_ALERTS 를 전달해 사용한다.
 */
export default function DocumentAlertDialog({
  open, title, message, confirmLabel, cancelLabel, danger = false, onConfirm, onClose,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: 4, width: 480, maxWidth: 480 } }}
    >
      <Box sx={{ px: 3, pt: 3, pb: 0.5 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: DARK }}>{title}</Typography>
      </Box>
      <Box sx={{ px: 3, py: 1 }}>
        <Typography sx={{ fontSize: 16, color: SECONDARY, whiteSpace: 'pre-line', lineHeight: 1.5 }}>
          {message}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, px: 3, py: 3 }}>
        {cancelLabel && (
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              height: 36, px: 1.5, borderRadius: 1, fontSize: 14, fontWeight: 400,
              color: DARK, borderColor: 'var(--nab-border-strong)',
              '&:hover': { borderColor: SECONDARY, bgcolor: 'transparent' },
            }}
          >
            {cancelLabel}
          </Button>
        )}
        <Button
          variant="contained"
          onClick={onConfirm}
          sx={{
            height: 36, px: 1.5, borderRadius: 1, fontSize: 14, fontWeight: 400,
            color: 'white', boxShadow: 'none',
            bgcolor: danger ? 'var(--nab-danger)' : 'var(--nab-button)',
            '&:hover': {
              bgcolor: danger ? 'var(--nab-danger-hover)' : 'var(--nab-button-hover)',
              boxShadow: 'none',
            },
          }}
        >
          {confirmLabel}
        </Button>
      </Box>
    </Dialog>
  );
}
