import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// NEXT_PUBLIC_ 접두어도 클라이언트에 노출한다 (NAB 서버 URL을 BE와 같은 키 이름으로 공유).
const ENV_PREFIX = ['VITE_', 'NEXT_PUBLIC_'];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ENV_PREFIX);
  // same-origin `/api` 호출이 남아있을 때(프록시 경유) 향할 대상.
  const proxyTarget = env.NEXT_PUBLIC_NAB_SERVER_URL || 'http://127.0.0.1:8080';


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
