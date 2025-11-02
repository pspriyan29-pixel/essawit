import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { trackPageView } from './utils/analytics';
import { initializeMonitoring } from './utils/monitoring';
import PageLoader from './components/PageLoader';
import './index.css';

// Initialize monitoring
if (typeof window !== 'undefined') {
  initializeMonitoring();
}

// Lazy load App component for code splitting
const App = lazy(() => import('./App'));

// Enhanced QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Track initial page load
if (typeof window !== 'undefined') {
  trackPageView(window.location.pathname, document.title);
  
  // Track navigation changes
  window.addEventListener('popstate', () => {
    trackPageView(window.location.pathname, document.title);
  });
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader message="Memuat aplikasi..." />}>
          <App />
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

