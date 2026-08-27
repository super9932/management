import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { isLocalDevHost } from './utils/is-local-dev';

/**
 * MSW 목 서버는 VITE_USE_MSW=true 일 때만 켠다.
 * 기본값은 꺼짐 — 실서버(NEXT_PUBLIC_NAB_SERVER_URL)로만 나간다.
 */
const USE_MSW = import.meta.env.DEV && import.meta.env.VITE_USE_MSW === 'true';

const RELOAD_GUARD_KEY = 'msw-unregistered-reload';

/**
 * 이전에 등록해 둔 목 서비스워커를 제거한다.
 * unregister()는 현재 페이지를 제어 중인 워커까지 즉시 멈추지는 못하므로,
 * 제어 중인 워커가 있었다면 (세션당 한 번만) 새로고침해 완전히 떼어낸다.
 */
async function stopMockWorker() {
  if (!('serviceWorker' in navigator)) return;

  const registrations = await navigator.serviceWorker.getRegistrations();
  const mockRegistrations = registrations.filter((registration) =>
    [registration.active, registration.installing, registration.waiting].some((worker) =>
      worker?.scriptURL.includes('mockServiceWorker')
    )
  );

  if (mockRegistrations.length === 0) return;

  await Promise.all(mockRegistrations.map((registration) => registration.unregister()));

  if (navigator.serviceWorker.controller && !sessionStorage.getItem(RELOAD_GUARD_KEY)) {
    sessionStorage.setItem(RELOAD_GUARD_KEY, '1');
    window.location.reload();
  }
}

async function bootstrap() {
  if (USE_MSW) {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  } else {
    await stopMockWorker();
  }

  /**
   * ⚠️ 개발 전용 — 401 재시도용 토큰 갱신기를 등록한다.
   * 로컬 머신에서만 등록한다(배포된 개발 서버 포함, 그 외 환경에서는 등록하지 않는다).
   * 등록된 갱신기가 없으면 axios 는 401 을 그대로 호출부로 넘기고,
   * 로그인·갱신은 상위 템플릿이 맡는다.
   */
  // import.meta.env.DEV 를 앞에 두어야 운영 빌드에서 이 분기와 동적 import 가 통째로 제거된다
  // (isLocalDevHost 안에도 같은 검사가 있지만 함수 호출이라 번들러가 들여다보지 못한다).
  if (import.meta.env.DEV && isLocalDevHost()) {
    const { installNabTokenRefresher } = await import('./dev/nab-token');
    installNabTokenRefresher();
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap();
