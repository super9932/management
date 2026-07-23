import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { DARK } from '../../_lib/tokens';

const PAGES = [1, 2, 3, 4, 5];

interface Props {
  page: number;
  onChange: (p: number) => void;
}

export default function DocumentPagination({ page, onChange }: Props) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 2.5, gap: 0.5, alignItems: 'center' }}>
      <IconButton size="small" sx={{ width: 40, height: 40, opacity: 0.48 }}>
        <KeyboardDoubleArrowLeftIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <IconButton size="small" sx={{ width: 40, height: 40, opacity: 0.48 }}>
        <ArrowBackIosIcon sx={{ fontSize: 16 }} />
      </IconButton>
      {PAGES.map((p) => (
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
      <Box sx={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <Typography sx={{ fontSize: 14, color: DARK }}>…</Typography>
      </Box>
      <IconButton size="small" sx={{ width: 40, height: 40 }}>
        <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
      </IconButton>
      <IconButton size="small" sx={{ width: 40, height: 40 }}>
        <KeyboardDoubleArrowRightIcon sx={{ fontSize: 20 }} />
      </IconButton>
    </Box>
  );
}
