import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ENV_CONFIG } from './config-global';

/**
 * MSW 목 서버는 VITE_USE_MSW=true 일 때만 켠다.
 * 기본값은 꺼짐 — 실서버(NEXT_PUBLIC_NAB_SERVER_URL)로만 나간다.
 * 켜지면 config-global 이 API 베이스를 same-origin 으로 돌려 인증 없이 개발할 수 있다.
 */
const USE_MSW = ENV_CONFIG.USE_MSW;

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


  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap();
