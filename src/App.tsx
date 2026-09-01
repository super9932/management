import { lazy, Suspense } from 'react';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import PromptManagement from './pages/nab/customer-touch/prompt-management';
import InsuranceTerms from './pages/nab/counsel/insurance-terms';
import InsuranceReview from './pages/nab/counsel/insurance-review';
import InsuranceCommon from './pages/nab/counsel/insurance-common';
import UnderwritingManual from './pages/nab/counsel/underwriting-manual';
import CounselStatistics from './pages/nab/counsel/counsel-statistics';
import SystemSetting from './pages/nab/counsel/system-setting';
import Statistics from './pages/nab/customer-touch/statistics';
import ServiceManagement from './pages/nab/customer-touch/service-management';
import { isLocalDevHost } from './utils/is-local-dev';

/**
 * ⚠️ 개발 전용 사번 로그인 — 로그인은 상위 템플릿이 담당한다.
 *
 * 두 겹으로 막는다.
 * 1) 빌드: 삼항 조건이 false 로 치환되며 동적 import 가 제거돼 청크조차 생기지 않는다.
 * 2) 실행: 개발 번들이라도 호스트가 로컬이 아니면 라우트를 등록하지 않는다
 *    (배포된 개발 서버·`vite dev --host` 로 노출된 주소 대비).
 *
 * 템플릿 반입 시 src/dev 폴더와 아래 라우트만 지우면 된다.
 */
const DevLoginPage = import.meta.env.DEV ? lazy(() => import('./dev/DevLoginPage')) : null;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {DevLoginPage && isLocalDevHost() && (
            <Route
              path="/dev-login"
              element={
                <Suspense fallback={null}>
                  <DevLoginPage />
                </Suspense>
              }
            />
          )}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/prompt-management" replace />} />
            <Route path="/prompt-management" element={<PromptManagement />} />
            <Route path="/insurance-terms" element={<InsuranceTerms />} />
            <Route path="/insurance-review" element={<InsuranceReview />} />
            <Route path="/insurance-common" element={<InsuranceCommon />} />
            <Route path="/underwriting-manual" element={<UnderwritingManual />} />
            <Route path="/counsel-statistics" element={<CounselStatistics />} />
            <Route path="/system-setting" element={<SystemSetting />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/service-management" element={<ServiceManagement />} />
            <Route path="*" element={<Navigate to="/prompt-management" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
