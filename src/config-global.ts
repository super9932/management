/** 전역 환경설정 — vite 환경변수(import.meta.env)를 한 곳에서 읽는다. */

/**
 * NAB 서버 오리진. 지정하면 NAB API를 해당 서버로 직접 호출한다(예: 스테이징).
 * 미지정 시 same-origin `/api`로 나가고 dev에서는 vite 프록시/MSW를 탄다.
 */
const NAB_SERVER_URL = (import.meta.env.NEXT_PUBLIC_NAB_SERVER_URL ?? '').replace(/\/+$/, '');

export const ENV_CONFIG = {
  NAB_SERVER_URL,
  /** NAB API 베이스 — 서버 오리진이 있으면 절대경로, 없으면 same-origin `/api` */
  APP_API_BASE_URL:
    NAB_SERVER_URL !== ''
      ? `${NAB_SERVER_URL}/api`
      : (import.meta.env.VITE_APP_API_BASE_URL ?? '/api'),
} as const;
