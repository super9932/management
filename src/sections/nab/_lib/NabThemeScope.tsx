import { useMemo } from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
import { Box, ThemeProvider, createTheme, useTheme } from '@mui/material';

import { NAB_VARS_DARK, NAB_VARS_LIGHT } from './tokens';

import type { ReactNode } from 'react';

/**
 * nab 섹션 전용 테마 스코프.
 *
 * 1) 이식 대상 프로젝트의 전역 MUI 오버라이드(palette·typography·components)가 우리
 *    컴포넌트로 스며드는 것을 차단한다.  ⚠️ theme를 "함수"로 넘겨야 부모(호스트)
 *    테마를 무시한다. 객체로 넘기면 병합돼 오버라이드가 따라온다.
 * 2) 라이트/다크는 브라우저가 아니라 "호스트 테마의 palette.mode"를 따라간다.
 *    (호스트가 자체 값으로 모드를 토글하는 구조에 맞춤. useTheme()로 호스트 모드를 읽어
 *     우리 스코프 테마와 CSS 변수 세트에 그대로 반영한다.)
 *    - MUI 표면(Card·Paper·Table·Menu·Dialog·Typography)은 palette.mode로 전환된다.
 *    - 우리 브랜드 색은 :root의 CSS 변수(--nab-*)로 전환된다. Dialog·Select 메뉴처럼
 *      포털로 body에 렌더되는 요소까지 닿도록 변수는 :root에 전역으로 깐다.
 */
export function NabThemeScope({ children }: { children: ReactNode }) {
  // 호스트 테마의 모드를 그대로 따른다. 호스트에 테마가 없으면 기본값 'light'.
  const outer = useTheme();
  const isDark = outer.palette?.mode === 'dark';
  const mode = isDark ? 'dark' : 'light';

  const vars = isDark ? NAB_VARS_DARK : NAB_VARS_LIGHT;

  // ⚠️ primary 등 팔레트 컬러는 지정하지 않는다. 일부 호스트가 팔레트 타입을
  //    augmentation으로 확장해(main 외 lighter/darker 요구) 타입 에러를 낸다.
  //    브랜드 색은 CSS 변수(--nab-*)로 칠하므로 스코프 테마엔 mode/배경/글자만 둔다.
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(isDark
            ? {
                background: { default: '#191C1F', paper: '#1e2225' },
                text: { primary: '#e6e8ea', secondary: '#9aa4ad' },
              }
            : {}),
        },
      }),
    [mode, isDark]
  );

  return (
    <ThemeProvider theme={() => theme}>
      <GlobalStyles styles={{ ':root': vars }} />
      <Box sx={{ bgcolor: 'background.default', color: 'text.primary' }}>{children}</Box>
    </ThemeProvider>
  );
}

export default NabThemeScope;
