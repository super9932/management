import { Box, Typography } from '@mui/material';

const imgGroup = 'http://localhost:3845/assets/a256c302b6c94b257528a5ce7f81022379ffac1c.svg';
const imgRect = 'http://localhost:3845/assets/50058a164b4dc53b2de2e4f3e64212d8fa45fc93.png';

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
        bgcolor: 'rgba(140,149,157,0.08)',
        border: '1px dashed rgba(140,149,157,0.32)',
        borderRadius: 2,
        py: 5,
      }}
    >
      {/* 일러스트 */}
      <Box sx={{ position: 'relative', width: 64, height: 64 }}>
        <Box
          sx={{
            position: 'absolute',
            inset: '19.66% 14.51% 9.37% 14.53%',
            bgcolor: '#8c959d',
            opacity: 0.48,
            borderRadius: '7.3px',
          }}
        />
        <Box
          component="img"
          src={imgGroup}
          alt=""
          sx={{
            position: 'absolute',
            inset: '9.38% 24.12% 33.15% 24.08%',
            width: '51.8%',
            height: '57.5%',
            opacity: 0.48,
            objectFit: 'contain',
          }}
        />
        <Box
          component="img"
          src={imgRect}
          alt=""
          sx={{
            position: 'absolute',
            top: '46.63%',
            left: '14.53%',
            width: 45,
            height: 28,
            opacity: 0.48,
            objectFit: 'contain',
          }}
        />
      </Box>

      {/* 텍스트 */}
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 700,
          color: '#8c959d',
          textAlign: 'center',
          lineHeight: '28px',
        }}
      >
        프롬프트를 등록해주세요
      </Typography>
    </Box>
  );
}
