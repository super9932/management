/** 전역 환경설정 — vite 환경변수(import.meta.env)를 한 곳에서 읽는다. */
export const ENV_CONFIG = {
  APP_API_BASE_URL: import.meta.env.VITE_APP_API_BASE_URL ?? '/api',
} as const;
