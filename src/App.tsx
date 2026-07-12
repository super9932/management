import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import PromptManagement from './pages/prompt-management';
import DocumentManagement from './pages/document-management';
import Statistics from './pages/statistics';
import ServiceManagement from './pages/service-management';

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
            <Route path="/document-management" element={<DocumentManagement />} />
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
