// nab 섹션 공용 디자인 토큰 (색상 / 그림자 / 공용 sx)
// createTheme/ThemeProvider 없이 순수 상수만 — 커스텀 MUI 테마가 아니다.
export const PRIMARY_ORANGE = '#fa6600';
export const DARK = '#272b2f';
export const SECONDARY = '#737c85';
export const SECONDARY_16 = 'rgba(115,124,133,0.16)';
export const BUTTON_DARK = '#485059';
export const DISABLED = '#8c959d';
export const DIVIDER = 'rgba(145,158,171,0.2)';
export const SIDEBAR_BG = '#ffffff';
export const CARD_SHADOW =
  '0px 0px 2px 0px rgba(25,28,31,0.08), 0px 12px 24px -4px rgba(25,28,31,0.06)';

export const FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    height: 54,
    fontSize: 14,
    '& fieldset': { borderColor: 'rgba(145,158,171,0.2)' },
    '&:hover fieldset': { borderColor: 'rgba(140,149,157,0.5)' },
  },
  '& .MuiInputLabel-root': { fontSize: 12, fontWeight: 700, color: '#737c85' },
  '& .MuiInputBase-input': { color: '#272b2f' },
} as const;
