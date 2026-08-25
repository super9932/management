import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { DARK } from '../../_lib/tokens';

interface Props {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}

/** 현재 페이지를 중심으로 최대 5개까지 노출한다 */
const PAGE_WINDOW = 5;

const pageNumbers = (page: number, totalPages: number): number[] => {
  const start = Math.max(1, Math.min(page - Math.floor(PAGE_WINDOW / 2), totalPages - PAGE_WINDOW + 1));
  const end = Math.min(totalPages, start + PAGE_WINDOW - 1);

  return Array.from({ length: Math.max(end - start + 1, 0) }, (_, i) => start + i);
};

export default function PromptPagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = pageNumbers(page, totalPages);
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2.5, gap: 0.5, alignItems: 'center' }}>
      <IconButton
        size="small"
        disabled={isFirst}
        onClick={() => onChange(1)}
        sx={{ width: 40, height: 40, opacity: isFirst ? 0.48 : 1 }}
      >
        <KeyboardDoubleArrowLeftIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <IconButton
        size="small"
        disabled={isFirst}
        onClick={() => onChange(page - 1)}
        sx={{ width: 40, height: 40, opacity: isFirst ? 0.48 : 1 }}
      >
        <ArrowBackIosIcon sx={{ fontSize: 16 }} />
      </IconButton>

      {pages.map((p) => (
        <Box
          key={p}
          onClick={() => onChange(p)}
          sx={{
            width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%', cursor: 'pointer',
            bgcolor: page === p ? DARK : 'transparent',
            '&:hover': { bgcolor: page === p ? DARK : 'var(--nab-hover-subtle)' },
          }}
        >
          <Typography sx={{ fontSize: page === p ? 14 : 16, color: page === p ? 'white' : DARK, fontWeight: page === p ? 600 : 400 }}>
            {p}
          </Typography>
        </Box>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <Box sx={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ fontSize: 14, color: DARK }}>…</Typography>
        </Box>
      )}

      <IconButton
        size="small"
        disabled={isLast}
        onClick={() => onChange(page + 1)}
        sx={{ width: 40, height: 40, opacity: isLast ? 0.48 : 1 }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
      </IconButton>
      <IconButton
        size="small"
        disabled={isLast}
        onClick={() => onChange(totalPages)}
        sx={{ width: 40, height: 40, opacity: isLast ? 0.48 : 1 }}
      >
        <KeyboardDoubleArrowRightIcon sx={{ fontSize: 20 }} />
      </IconButton>
    </Box>
  );
}
