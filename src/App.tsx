import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const AnalysisPage = lazy(() => import('./pages/AnalysisPage'));

function AppHeader() {
  const location = useLocation();
  return (
    <header className="app-header">
      <Link to="/" className="logo">
        <span className="logo-icon">CA</span>
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
      fontSize: 15,
    }}>
      Loading...
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
