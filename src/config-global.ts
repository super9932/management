/** 전역 환경설정 — vite 환경변수(import.meta.env)를 한 곳에서 읽는다. */

/**
 * NAB 서버 오리진. 지정하면 NAB API를 해당 서버로 직접 호출한다(예: 스테이징).
 * 미지정 시 same-origin `/api`로 나가고 dev에서는 vite 프록시/MSW를 탄다.
 */
const NAB_SERVER_URL = (import.meta.env.NEXT_PUBLIC_NAB_SERVER_URL ?? '').replace(/\/+$/, '');

/**
 * 목(MSW) 모드 — dev 에서 VITE_USE_MSW=true 일 때만 켜진다. main.tsx 와 같은 조건이다.
 *
 * MSW 핸들러는 same-origin `/api/...` 로 등록돼 있어서, 서버 오리진이 지정돼 있으면
 * 요청이 절대 URL 로 나가 목을 통과해 버린다. 목 모드에서는 오리진을 무시해
 * 스위치 하나(VITE_USE_MSW)만으로 인증 없이 개발할 수 있게 한다.
 */
const USE_MSW = import.meta.env.DEV && import.meta.env.VITE_USE_MSW === 'true';

const apiBaseUrl = () => {
  if (USE_MSW) {
    return '/api';
  }

  return NAB_SERVER_URL !== ''
    ? `${NAB_SERVER_URL}/api`
    : (import.meta.env.VITE_APP_API_BASE_URL ?? '/api');
};

export const ENV_CONFIG = {
  NAB_SERVER_URL,
  USE_MSW,
  /** NAB API 베이스 — 목 모드면 same-origin, 서버 오리진이 있으면 절대경로, 없으면 `/api` */
  APP_API_BASE_URL: apiBaseUrl(),
} as const;
