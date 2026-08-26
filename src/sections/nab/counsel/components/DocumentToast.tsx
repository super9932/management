import { Box, IconButton, Snackbar, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import { DARK, SECONDARY } from '../../_lib/tokens';

/**
 * 문서 작업 결과 토스트 (Figma COM_공통정의_003 Toast).
 *
 * 흰 배경 + 좌측 아이콘 칩(성공 초록 16% / 실패 빨강 16%) + 본문 + 닫기.
 * 저장·삭제 성공/실패 안내에 쓴다.
 */

export type DocumentToastSeverity = 'success' | 'error';

interface Props {
  /** 문구가 비어 있으면 닫힌 상태로 본다 */
  message: string;
  severity: DocumentToastSeverity;
  onClose: () => void;
  /** 자동 닫힘(ms) */
  autoHideDuration?: number;
}

const ICON_STYLE: Record<DocumentToastSeverity, { fg: string; bg: string }> = {
  success: { fg: 'var(--nab-label-green-fg)', bg: 'var(--nab-label-green-bg)' },
  error: { fg: 'var(--nab-label-red-fg)', bg: 'var(--nab-label-red-bg)' },
};

export default function DocumentToast({
  message,
  severity,
  onClose,
  autoHideDuration = 3000,
}: Props) {
  const { fg, bg } = ICON_STYLE[severity];
  const Icon = severity === 'success' ? CheckCircleIcon : ErrorIcon;

  return (
    <Snackbar
      open={message !== ''}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          pl: 0.5,
          py: 0.5,
          width: 420,
          maxWidth: '100%',
          borderRadius: 1,
          bgcolor: 'var(--nab-surface)',
          boxShadow: '0px 8px 16px 0px rgba(145,158,171,0.16)',
        }}
      >
        <Box
          sx={{
            width: 48, height: 48, flexShrink: 0, borderRadius: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: bg,
          }}
        >
          <Icon sx={{ fontSize: 24, color: fg }} />
        </Box>
        <Typography sx={{ flex: 1, minWidth: 0, fontSize: 14, lineHeight: '22px', color: DARK }}>
          {message}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
          <IconButton size="small" onClick={onClose} sx={{ width: 28, height: 28 }}>
            <CloseIcon sx={{ fontSize: 18, color: SECONDARY }} />
          </IconButton>
        </Box>
      </Box>
    </Snackbar>
  );
}
