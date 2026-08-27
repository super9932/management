/* =============================================================================
 * ⚠️ [로컬 개발 전용] NAB 토큰 보관과 갱신 — 배포 환경 반입 금지
 *
 * 배포 환경(개발 서버 포함)에서는 로그인·토큰 갱신을 상위 템플릿이 담당한다.
 * 이 파일은 개발자 로컬 머신에서 사번 로그인으로 받은 토큰을 유지하기 위한 것이며,
 * src/dev 폴더째 지우면 된다.
 *
 * AccessToken 은 axios 인터셉터가 store 에서 읽어 쓰므로 store 에 넣고,
 * RefreshToken 은 갱신에만 쓰이므로 **메모리에만** 둔다(새로고침 시 재로그인).
 * =============================================================================
 */
import { nabRefreshTokens } from './nab-dev-login';
import { clearAccessToken, saveAccessToken, store } from '../store';
import { registerTokenRefresher } from '../utils/token-refresh';

import type { NabTokens } from './nab-dev-login';

/** RefreshToken — localStorage 에 두면 XSS 노출 면적이 커져 메모리에만 유지한다 */
let refreshToken: string | null = null;

/**
 * 진행 중인 갱신 요청 핸들 (single-flight).
 * 동시에 여러 요청이 401 을 받아도 갱신은 한 번만 나가야 한다 —
 * RefreshToken 회전 방식이라 갱신이 2회 겹치면 한쪽 토큰이 무효화되어 세션이 끊긴다.
 */
let refreshInFlight: Promise<void> | null = null;

/** 로그인·갱신으로 받은 토큰을 반영한다 */
export const setNabTokens = ({ accessToken, refreshToken: nextRefreshToken, tokenType }: NabTokens): void => {
  refreshToken = nextRefreshToken;
  // 기존 인터셉터가 헤더에 그대로 싣는 값이라 여기서 'Bearer ' 접두어까지 붙여 둔다.
  store.dispatch(saveAccessToken(`${tokenType ?? 'Bearer'} ${accessToken}`));
};

/** 보관 중인 토큰을 모두 비운다 */
export const clearNabTokens = (): void => {
  refreshToken = null;
  store.dispatch(clearAccessToken());
};

/** 갱신 가능 여부 — RefreshToken 이 없으면 재로그인 외에는 방법이 없다 */
export const canRefreshNabToken = (): boolean => refreshToken !== null;

/**
 * AccessToken 을 갱신한다. 동시에 여러 번 불려도 실제 요청은 1회만 나간다.
 *
 * @returns 갱신 완료 시 resolve, 실패 시 reject (호출부는 재로그인으로 유도한다)
 */
export const refreshNabToken = async (): Promise<void> => {
  if (!refreshToken) {
    throw new Error('RefreshToken 이 없습니다. 다시 로그인해주세요.');
  }

  refreshInFlight ??= (async () => {
    try {
      setNabTokens(await nabRefreshTokens(refreshToken as string));
    } catch (error) {
      clearNabTokens();

      throw error;
    }
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
};

/**
 * 401 재시도용 갱신기를 axios 에 등록한다.
 * 개발 부트스트랩(main.tsx)에서만 호출되며, 운영 번들에는 이 호출이 없다.
 */
export const installNabTokenRefresher = (): void => {
  registerTokenRefresher({ canRefresh: canRefreshNabToken, refresh: refreshNabToken });
};
