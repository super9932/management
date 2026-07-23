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
import Statistics from './pages/nab/customer-touch/statistics';
import ServiceManagement from './pages/nab/customer-touch/service-management';

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
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/prompt-management" replace />} />
            <Route path="/prompt-management" element={<PromptManagement />} />
            <Route path="/insurance-terms" element={<InsuranceTerms />} />
            <Route path="/insurance-review" element={<InsuranceReview />} />
            <Route path="/insurance-common" element={<InsuranceCommon />} />
            <Route path="/underwriting-manual" element={<UnderwritingManual />} />
            <Route path="/counsel-statistics" element={<CounselStatistics />} />
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
