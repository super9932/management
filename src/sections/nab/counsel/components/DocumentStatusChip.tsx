import { Box } from '@mui/material';
import type { OperationStatus } from '../type';

const STATUS_STYLE: Record<OperationStatus, { fg: string; bg: string }> = {
  운영중: { fg: 'var(--nab-label-green-fg)', bg: 'var(--nab-label-green-bg)' },
  오류: { fg: 'var(--nab-label-red-fg)', bg: 'var(--nab-label-red-bg)' },
  미운영: { fg: 'var(--nab-label-gray-fg)', bg: 'var(--nab-label-gray-bg)' },
};

interface Props {
  status: OperationStatus;
}

export default function DocumentStatusChip({ status }: Props) {
  const { fg, bg } = STATUS_STYLE[status];
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 24,
        height: 24,
        px: 0.75,
        borderRadius: '6px',
        bgcolor: bg,
        color: fg,
        fontSize: 12,
        fontWeight: 700,
        lineHeight: '20px',
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </Box>
  );
}
