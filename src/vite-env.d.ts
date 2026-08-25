/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** NAB 서버 오리진 (예: https://nxl-nab-stg.hanwhalife.com). 미지정 시 same-origin `/api` */
  readonly NEXT_PUBLIC_NAB_SERVER_URL?: string;
  /** NAB API 베이스를 직접 지정할 때 사용 (NEXT_PUBLIC_NAB_SERVER_URL이 우선한다) */
  readonly VITE_APP_API_BASE_URL?: string;
  /** 'true' 일 때만 MSW 목 서버를 켠다 (dev 한정). 기본값은 꺼짐 = 실서버 호출 */
  readonly VITE_USE_MSW?: string;

  // ── ⚠️ 개발 전용 NAB 사번 로그인 (운영 반입 금지 — src/auth/nab-dev-login.ts 참고) ──
  /** OTT 발급용 API Key */
  readonly VITE_OTT_API_KEY?: string;
  /** OTT 발급용 API Secret */
  readonly VITE_OTT_API_SECRET?: string;
  /** 토큰 교환·갱신용 client id */
  readonly VITE_TOKEN_CLIENT_ID?: string;
  /** 토큰 교환·갱신용 client secret */
  readonly VITE_TOKEN_CLIENT_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
