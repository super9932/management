import { Box, Typography } from '@mui/material';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';

export default function StatisticsEmptyState() {
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
      <InsertChartOutlinedIcon sx={{ fontSize: 64, color: 'var(--nab-text-disabled)', opacity: 0.48 }} />
      <Typography sx={{ fontSize: 18, fontWeight: 700, color: 'var(--nab-text-disabled)', textAlign: 'center', lineHeight: '28px' }}>
        조회된 통계 데이터가 없습니다
      </Typography>
    </Box>
  );
}
