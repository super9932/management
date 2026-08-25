/* =============================================================================
 * ⚠️ [개발 전용] NAB 사번 로그인 — 운영 반입 금지
 *
 * OTT 발급·토큰 교환에 필요한 자격증명(apiKey/apiSecret/clientId/clientSecret)을
 * 브라우저에서 직접 쓴다. Vite 는 이 값들을 번들에 그대로 박으므로,
 * 배포되면 누구나 꺼내 임의의 사번으로 토큰을 발급받을 수 있다.
 *
 * 운영으로 가려면 아래 둘 중 하나로 대체할 것:
 *   - 시크릿을 감춘 서버 엔드포인트 2개(OTT 발급·토큰 교환)를 두고 그쪽을 호출
 *   - 백엔드가 SPA 용 로그인 경로(clientSecret 불필요)를 제공하면 그것으로 교체
 * 어느 쪽이든 이 파일의 `nabDevLogin` 만 갈아끼우면 되고,
 * 토큰 저장·갱신(nab-token.ts)과 요청 인터셉터는 그대로 재사용된다.
 * =============================================================================
 */

/** NAB 인증 엔드포인트 (axios baseURL 과 무관하게 프록시 경유 절대경로로 호출한다) */
const NAB_AUTH_API = {
  /** 사번 → OTT 발급 */
  ottIssue: '/api/v1/post/auth/ott/issue',
  /** OTT → AccessToken/RefreshToken 교환 */
  tokenExchange: '/api/v1/post/auth/oauth2/token',
  /** RefreshToken → 토큰 갱신 */
  tokenRefresh: '/api/v1/post/auth/oauth2/refresh',
} as const;

/** 토큰 교환 grant type (OAuth token-exchange) */
const TOKEN_EXCHANGE_GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:token-exchange';
/** subject token type — 교환에 쓰는 토큰이 OTT 임을 알린다 */
const TOKEN_EXCHANGE_SUBJECT_TOKEN_TYPE = 'urn:hia:params:oauth:token-type:ott';

/** NAB 공통 응답 envelope */
interface NabEnvelope<T> {
  data?: T;
  message?: string;
  error?: { code?: string; message?: string } | null;
}

/** 토큰 교환·갱신 응답 본문 */
export interface NabTokens {
  accessToken: string;
  refreshToken: string;
  /** 'Bearer' 등. 미지정 시 Bearer 로 간주한다 */
  tokenType?: string;
}

/** OTT 발급 응답 (envelope 유무 모두 대응) */
interface NabOttIssueResponse extends NabEnvelope<{ ott?: string }> {
  ott?: string;
}

/** 개발 전용 자격증명 — 값이 없으면 로그인 시점에 명확히 실패시킨다 */
const credentials = () => ({
  apiKey: import.meta.env.VITE_OTT_API_KEY,
  apiSecret: import.meta.env.VITE_OTT_API_SECRET,
  clientId: import.meta.env.VITE_TOKEN_CLIENT_ID,
  clientSecret: import.meta.env.VITE_TOKEN_CLIENT_SECRET,
});

/** JSON POST 후 envelope 을 검사해 data 를 돌려준다 */
const postJson = async <T>(url: string, body: unknown): Promise<T> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const payload = (await response.json()) as NabEnvelope<T>;

  if (!response.ok || payload.error) {
    throw new Error(payload.error?.message ?? payload.message ?? `요청 실패 (status: ${response.status})`);
  }

  return payload.data as T;
};

/**
 * 사번으로 NAB AccessToken/RefreshToken 을 발급받는다.
 *
 * ① 사번 + 서버 자격증명 → OTT 발급
 * ② OTT → 토큰 교환 (OAuth token-exchange)
 *
 * @param emnb 사번
 * @returns 발급된 토큰
 */
export const nabDevLogin = async (emnb: string): Promise<NabTokens> => {
  if (!import.meta.env.DEV) {
    throw new Error('개발 환경에서만 사용할 수 있는 로그인입니다.');
  }

  const { apiKey, apiSecret, clientId, clientSecret } = credentials();

  if (!apiKey || !apiSecret || !clientId || !clientSecret) {
    throw new Error(
      '.env.local 에 VITE_OTT_API_KEY / VITE_OTT_API_SECRET / VITE_TOKEN_CLIENT_ID / VITE_TOKEN_CLIENT_SECRET 를 채워주세요.'
    );
  }

  if (!emnb.trim()) {
    throw new Error('사번을 입력해주세요.');
  }

  // ① OTT 발급 — 응답이 envelope 일 수도, 평평할 수도 있어 둘 다 받는다
  const ottResponse = await fetch(NAB_AUTH_API.ottIssue, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey, apiSecret, emnb: emnb.trim() }),
  });

  const ottPayload = (await ottResponse.json()) as NabOttIssueResponse;
  const ott = ottPayload.ott ?? ottPayload.data?.ott;

  if (!ottResponse.ok || !ott) {
    throw new Error(ottPayload.message ?? `OTT 발급에 실패했습니다. (status: ${ottResponse.status})`);
  }

  // ② 토큰 교환
  return postJson<NabTokens>(NAB_AUTH_API.tokenExchange, {
    clientId,
    clientSecret,
    grantType: TOKEN_EXCHANGE_GRANT_TYPE,
    subjectToken: ott,
    subjectTokenType: TOKEN_EXCHANGE_SUBJECT_TOKEN_TYPE,
  });
};

/**
 * RefreshToken 으로 토큰을 갱신한다.
 *
 * @param refreshToken 갱신에 사용할 RefreshToken
 * @returns 새로 발급된 토큰
 */
export const nabRefreshTokens = async (refreshToken: string): Promise<NabTokens> => {
  const { clientId, clientSecret } = credentials();

  return postJson<NabTokens>(NAB_AUTH_API.tokenRefresh, { clientId, clientSecret, refreshToken });
};
