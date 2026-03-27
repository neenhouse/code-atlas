import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const AnalysisPage = lazy(() => import('./pages/AnalysisPage'));

function AppHeader() {
  const location = useLocation();
  return (
    <header className="app-header">
      <Link to="/" className="logo">
        <span className="logo-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="3" />
            <circle cx="5" cy="6" r="1.5" />
            <circle cx="19" cy="6" r="1.5" />
            <circle cx="5" cy="18" r="1.5" />
            <circle cx="19" cy="18" r="1.5" />
            <line x1="6.5" y1="7" x2="9.5" y2="10" />
            <line x1="17.5" y1="7" x2="14.5" y2="10" />
            <line x1="6.5" y1="17" x2="9.5" y2="14" />
            <line x1="17.5" y1="17" x2="14.5" y2="14" />
          </svg>
        </span>
        CodeAtlas
      </Link>
      <nav>
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Home
        </Link>
        <Link to="/app" className={location.pathname === '/app' ? 'active' : ''}>
          Analyze
        </Link>
      </nav>
    </header>
  );
}

function Loading() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      color: 'var(--text-secondary)',
      fontSize: 14,
      gap: 8,
    }}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{
          animation: 'spin 1s linear infinite',
        }}
      >
        <path d="M21 12a9 9 0 11-6.219-8.56" />
      </svg>
      Loading...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppHeader />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<AnalysisPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
