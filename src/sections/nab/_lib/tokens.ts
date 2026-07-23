// nab 섹션 공용 디자인 토큰.
//
// 값은 CSS 변수(var(--nab-*))로 참조하고, 실제 색은 NAB_VARS_LIGHT / NAB_VARS_DARK가
// 가진다. NabThemeScope가 이 변수를 :root에 깔고 prefers-color-scheme로 전환하므로,
// 컴포넌트 코드는 그대로 두고도 브라우저 테마(라이트/다크)에 자동 반응한다.
// createTheme/ThemeProvider가 아닌 순수 상수 — 커스텀 MUI 테마가 아니다.

export const PRIMARY_ORANGE = 'var(--nab-primary)';
export const DARK = 'var(--nab-text-primary)';
export const SECONDARY = 'var(--nab-text-secondary)';
export const SECONDARY_16 = 'var(--nab-fill-16)';
export const BUTTON_DARK = 'var(--nab-button)';
export const DISABLED = 'var(--nab-text-disabled)';
export const DIVIDER = 'var(--nab-divider)';
export const SIDEBAR_BG = 'var(--nab-surface)';
export const CARD_SHADOW = 'var(--nab-card-shadow)';
/** 상세 팝업 컨텐츠/활성 탭 배경 (paper 위에 얹히는 연회색 popup_bg) */
export const POPUP_BG = 'var(--nab-popup-bg)';

export const FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    height: 54,
    fontSize: 14,
    '& fieldset': { borderColor: 'var(--nab-border)' },
    '&:hover fieldset': { borderColor: 'var(--nab-border-hover)' },
  },
  '& .MuiInputLabel-root': { fontSize: 12, fontWeight: 700, color: 'var(--nab-text-secondary)' },
  '& .MuiInputBase-input': { color: 'var(--nab-text-primary)' },
} as const;

/** :root에 주입되는 라이트 모드 CSS 변수 값 */
export const NAB_VARS_LIGHT = {
  '--nab-primary': '#fa6600',
  '--nab-primary-hover': '#e05a00',
  '--nab-text-primary': '#272b2f',
  '--nab-text-secondary': '#737c85',
  '--nab-text-disabled': '#8c959d',
  '--nab-button': '#485059',
  '--nab-button-hover': '#3a4048',
  '--nab-surface': '#ffffff',
  '--nab-popup-bg': '#f6f7f7',
  '--nab-header-bg': '#f5f6f7',
  '--nab-row-hover': 'rgba(245,246,247,0.8)',
  '--nab-hover-subtle': 'rgba(140,149,157,0.08)',
  '--nab-hover-secondary': 'rgba(115,124,133,0.08)',
  '--nab-divider': 'rgba(145,158,171,0.2)',
  '--nab-border': 'rgba(140,149,157,0.2)',
  '--nab-border-hover': 'rgba(140,149,157,0.5)',
  '--nab-border-strong': 'rgba(140,149,157,0.48)',
  '--nab-border-dashed': 'rgba(140,149,157,0.32)',
  '--nab-fill-16': 'rgba(115,124,133,0.16)',
  '--nab-fill-24': 'rgba(140,149,157,0.28)',
  '--nab-card-shadow':
    '0px 0px 2px 0px rgba(25,28,31,0.08), 0px 12px 24px -4px rgba(25,28,31,0.06)',
  '--nab-status-blue': '#1e5ad2',
  '--nab-status-blue-bg': 'rgba(30,90,210,0.08)',
  '--nab-status-red': '#a71313',
  '--nab-status-red-bg': 'rgba(167,19,19,0.08)',
  '--nab-status-green': '#34745d',
  '--nab-status-green-bg': 'rgba(52,116,93,0.08)',
  '--nab-status-amber': '#c0750c',
  '--nab-status-amber-bg': 'rgba(192,117,12,0.08)',
  // 상태 라벨(문서 운영상태 등) — 공통정의의 success/error/gray 16% 라벨 규격
  '--nab-label-green-fg': '#34745d',
  '--nab-label-green-bg': 'rgba(65,149,118,0.16)',
  '--nab-label-red-fg': '#a71313',
  '--nab-label-red-bg': 'rgba(245,63,63,0.16)',
  '--nab-label-gray-fg': '#737c85',
  '--nab-label-gray-bg': 'rgba(140,149,157,0.16)',
} as const;

/** 다크 모드 오버라이드 값 */
export const NAB_VARS_DARK = {
  '--nab-primary': '#ff7a1a',
  '--nab-primary-hover': '#ff9147',
  '--nab-text-primary': '#e6e8ea',
  '--nab-text-secondary': '#9aa4ad',
  '--nab-text-disabled': '#6b747c',
  '--nab-button': '#5a636c',
  '--nab-button-hover': '#6b747c',
  '--nab-surface': '#1e2225',
  '--nab-popup-bg': '#17191c',
  '--nab-header-bg': '#2a2f34',
  '--nab-row-hover': 'rgba(255,255,255,0.06)',
  '--nab-hover-subtle': 'rgba(255,255,255,0.06)',
  '--nab-hover-secondary': 'rgba(255,255,255,0.06)',
  '--nab-divider': 'rgba(145,158,171,0.24)',
  '--nab-border': 'rgba(145,158,171,0.28)',
  '--nab-border-hover': 'rgba(145,158,171,0.44)',
  '--nab-border-strong': 'rgba(145,158,171,0.5)',
  '--nab-border-dashed': 'rgba(145,158,171,0.32)',
  '--nab-fill-16': 'rgba(255,255,255,0.12)',
  '--nab-fill-24': 'rgba(255,255,255,0.18)',
  '--nab-card-shadow':
    '0px 0px 2px 0px rgba(0,0,0,0.4), 0px 12px 24px -4px rgba(0,0,0,0.5)',
  '--nab-status-blue': '#6ea0ff',
  '--nab-status-blue-bg': 'rgba(110,160,255,0.16)',
  '--nab-status-red': '#ff8a8a',
  '--nab-status-red-bg': 'rgba(255,138,138,0.16)',
  '--nab-status-green': '#6fcaa6',
  '--nab-status-green-bg': 'rgba(111,202,166,0.16)',
  '--nab-status-amber': '#e6b062',
  '--nab-status-amber-bg': 'rgba(230,176,98,0.16)',
  '--nab-label-green-fg': '#6fcaa6',
  '--nab-label-green-bg': 'rgba(111,202,166,0.16)',
  '--nab-label-red-fg': '#ff8a8a',
  '--nab-label-red-bg': 'rgba(255,138,138,0.16)',
  '--nab-label-gray-fg': '#9aa4ad',
  '--nab-label-gray-bg': 'rgba(255,255,255,0.12)',
} as const;
