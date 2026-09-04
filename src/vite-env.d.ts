/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** NAB 서버 오리진 (예: https://nxl-nab-stg.hanwhalife.com). 미지정 시 same-origin `/api` */
  readonly NEXT_PUBLIC_NAB_SERVER_URL?: string;
  /** NAB API 베이스를 직접 지정할 때 사용 (NEXT_PUBLIC_NAB_SERVER_URL이 우선한다) */
  readonly VITE_APP_API_BASE_URL?: string;
  /** 'true' 일 때만 MSW 목 서버를 켠다 (dev 한정). 기본값은 꺼짐 = 실서버 호출 */
  readonly VITE_USE_MSW?: string;

  /** NAB API 인증 키 — 모든 요청의 x-api-header 에 실린다 (환경별로 값이 다르다) */
  readonly NEXT_PUBLIC_NAB_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
