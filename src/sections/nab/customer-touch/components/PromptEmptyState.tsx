import { Box, Typography } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

/** 목록이 비었을 때의 안내. 아이콘은 상담AI 문서 목록(DocumentEmptyState)과 같은 것을 쓴다. */
export default function PromptEmptyState() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        width: '100%',
        minHeight: 280,
        bgcolor: 'var(--nab-hover-subtle)',
        border: '1px dashed var(--nab-border-dashed)',
        borderRadius: 2,
        py: 5,
      }}
    >
      <DescriptionOutlinedIcon sx={{ fontSize: 56, color: 'var(--nab-text-disabled)', opacity: 0.48 }} />
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--nab-text-disabled)',
          textAlign: 'center',
          lineHeight: '28px',
        }}
      >
        프롬프트를 등록해주세요
      </Typography>
    </Box>
  );
}
