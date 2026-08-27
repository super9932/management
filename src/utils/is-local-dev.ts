/**
 * 개발용 사번 로그인을 열어줄지 판단한다.
 *
 * `import.meta.env.DEV` 만으로는 부족하다 — `vite build --mode development` 로 만든
 * 번들은 배포된 개발 서버에서도 DEV 가 true 이고, `vite dev --host` 로 띄우면
 * 같은 네트워크의 다른 기기에서도 접근된다. 그래서 **빌드 시점(DEV) + 실행 호스트**
 * 두 조건을 모두 만족할 때만 허용한다.
 *
 * 결과적으로 개발자 로컬 머신에서만 토큰을 직접 발급할 수 있고,
 * 배포된 환경에서는 로그인·토큰을 상위 템플릿이 담당한다.
 */

/** 로컬 루프백으로 인정하는 호스트명 */
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

/** 개발자 로컬 머신에서 실행 중인지 — 배포된 개발 서버에서는 false */
export const isLocalDevHost = (): boolean => {
  if (!import.meta.env.DEV) {
    return false;
  }

  if (typeof window === 'undefined') {
    return false;
  }

  const { hostname } = window.location;

  // *.localhost 도 루프백으로 해석된다 (RFC 6761)
  return LOCAL_HOSTNAMES.has(hostname) || hostname.endsWith('.localhost');
};
