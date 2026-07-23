import { Box, Typography } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

export default function DocumentEmptyState() {
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
        등록된 문서가 없습니다
      </Typography>
    </Box>
  );
}
