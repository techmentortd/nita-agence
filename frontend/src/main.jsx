import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import { ThemeLangProvider } from './context/ThemeLangContext';
import { NavVisibilityProvider } from './context/NavVisibilityContext';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeLangProvider>
      <NavVisibilityProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </NavVisibilityProvider>
    </ThemeLangProvider>
  </React.StrictMode>
);
