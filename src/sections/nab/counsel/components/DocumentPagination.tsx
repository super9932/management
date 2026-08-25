import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { DARK } from '../../_lib/tokens';

/** 현재 페이지를 중심으로 최대 5개까지 노출한다 */
const PAGE_WINDOW = 5;

interface Props {
  page: number;
  /** 전체 페이지 수. 미지정이면 목데이터 화면처럼 5페이지 고정으로 둔다 */
  totalPages?: number;
  onChange: (p: number) => void;
}

const pageNumbers = (page: number, totalPages: number): number[] => {
  const start = Math.max(1, Math.min(page - Math.floor(PAGE_WINDOW / 2), totalPages - PAGE_WINDOW + 1));
  const end = Math.min(totalPages, start + PAGE_WINDOW - 1);

  return Array.from({ length: Math.max(end - start + 1, 0) }, (_, i) => start + i);
};

export default function DocumentPagination({ page, totalPages = PAGE_WINDOW, onChange }: Props) {
  // 페이지가 없거나 하나뿐이어도 자리는 지킨다.
  // 목록 화면이 이 영역 위에 액션 버튼을 absolute 로 얹기 때문에, 높이가 0이면 버튼이 카드 밖으로 밀린다.
  // 80px = 페이지네이션이 있을 때와 같은 높이(위아래 여백 20px + 버튼 40px).
  if (totalPages <= 1) {
    return <Box sx={{ height: 80 }} />;
  }

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
