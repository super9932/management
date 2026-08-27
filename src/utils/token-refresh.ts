/**
 * 401 재시도용 토큰 갱신 훅.
 *
 * 이 화면들은 상위 템플릿 안으로 들어가고, 로그인과 토큰 갱신은 템플릿이 담당한다.
 * 그래서 axios 인터셉터는 "어떻게 갱신하는지"를 알지 않고, 등록된 갱신기가 있을 때만 부른다.
 * 갱신기를 등록하는 쪽은 개발·테스트용 사번 로그인(src/dev)뿐이며 운영 번들에는 없다.
 *
 * 템플릿이 자체 갱신 로직을 쓰고 싶다면 registerTokenRefresher 로 끼워 넣으면 되고,
 * 아무도 등록하지 않으면 401 은 그대로 호출부로 전달된다.
 */

export interface TokenRefresher {
  /** 갱신 가능 여부 — false 면 재시도하지 않고 401 을 그대로 흘려보낸다 */
  canRefresh: () => boolean;
  /** 토큰을 갱신한다. 실패 시 reject */
  refresh: () => Promise<void>;
}

let refresher: TokenRefresher | null = null;

/** 갱신기를 등록한다. null 을 넘기면 해제된다. */
export const registerTokenRefresher = (next: TokenRefresher | null): void => {
  refresher = next;
};

/** 등록된 갱신기 — 없으면 null */
export const getTokenRefresher = (): TokenRefresher | null => refresher;
