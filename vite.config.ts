import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// NEXT_PUBLIC_ 접두어도 클라이언트에 노출한다 (NAB 서버 URL을 BE와 같은 키 이름으로 공유).
const ENV_PREFIX = ['VITE_', 'NEXT_PUBLIC_'];

/**
 * 개발 전용 사번 로그인 자격증명 — 운영에서는 로그인을 상위 템플릿이 담당한다.
 * Vite 는 VITE_ 값을 번들에 그대로 인라인하므로, 배포 빌드에 남아 있으면 빌드를 멈춘다.
 */
const DEV_ONLY_ENV_KEYS = [
  'VITE_OTT_API_KEY',
  'VITE_OTT_API_SECRET',
  'VITE_TOKEN_CLIENT_ID',
  'VITE_TOKEN_CLIENT_SECRET',
] as const;

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), ENV_PREFIX);
  // same-origin `/api` 호출이 남아있을 때(프록시 경유) 향할 대상.
  const proxyTarget = env.NEXT_PUBLIC_NAB_SERVER_URL || 'http://127.0.0.1:8080';

  if (command === 'build') {
    const leaked = DEV_ONLY_ENV_KEYS.filter((key) => env[key]);

    if (leaked.length > 0) {
      throw new Error(
        `[빌드 중단] 개발 전용 자격증명이 배포 번들에 포함됩니다: ${leaked.join(', ')}\n` +
          '.env.local 에서 해당 값을 지우거나 주석 처리한 뒤 다시 빌드하세요. ' +
          '(운영 로그인은 상위 템플릿이 담당하므로 이 값들은 필요하지 않습니다)'
      );
    }
  }

  return {
    plugins: [react()],
    envPrefix: ENV_PREFIX,
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
