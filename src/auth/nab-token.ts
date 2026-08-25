/**
 * NAB 토큰 보관과 갱신.
 *
 * AccessToken 은 기존 axios 인터셉터가 store 에서 읽어 쓰므로 store 에 넣고,
 * RefreshToken 은 갱신에만 쓰이므로 **메모리에만** 둔다(새로고침 시 재로그인).
 * 발급 경로가 서버로 옮겨가도 이 파일은 그대로 쓸 수 있다.
 */
import { nabRefreshTokens } from './nab-dev-login';
import { clearAccessToken, saveAccessToken, store } from '../store';

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
