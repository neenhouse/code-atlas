import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero-section">
        <span className="badge">Codebase Intelligence Platform</span>
        <h1>
          Understand your code{' '}
          <span className="gradient-text">at a glance</span>
        </h1>
        <p className="subtitle">
          Upload a repo and get architecture diagrams, dependency graphs,
          complexity hotspots, and tech debt scoring -- in seconds.
        </p>
        <div className="hero-cta">
          <Link to="/app" className="btn btn-primary">
            Analyze Your Repo
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            View on GitHub
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-header">
          <h2>Everything you need to understand a codebase</h2>
          <p>From high-level architecture to individual file complexity</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <h3>Architecture Diagrams</h3>
            <p>
              Auto-generated box diagrams showing module structure, grouped by directory.
              See how your code layers connect at a glance.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="3" />
                <circle cx="5" cy="19" r="3" />
                <circle cx="19" cy="19" r="3" />
                <line x1="12" y1="8" x2="5" y2="16" />
                <line x1="12" y1="8" x2="19" y2="16" />
              </svg>
            </div>
            <h3>Dependency Graphs</h3>
            <p>
              Visualize package dependencies as an interactive node graph. Sized by install
              footprint, colored by category.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="2" />
                <rect x="4" y="4" width="8" height="8" rx="1" />
                <rect x="14" y="4" width="6" height="5" rx="1" />
                <rect x="4" y="14" width="6" height="6" rx="1" />
                <rect x="12" y="11" width="8" height="9" rx="1" />
              </svg>
            </div>
            <h3>Complexity Heatmap</h3>
            <p>
              Treemap visualization colored by complexity. Red hotspots jump out immediately.
              Hover to drill into file details.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#eab308' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5Z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3>Tech Debt Scorecard</h3>
            <p>
              Overall health grade (A-F) based on dependency count, complexity, outdated
              packages, test coverage, and project size.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-section">
        <h2>How it works</h2>
        <div className="how-steps">
          <div className="how-step">
            <div className="step-number">1</div>
            <h3>Upload</h3>
            <p>Paste your package.json or file tree. No signup, no config, no waiting.</p>
          </div>
          <div className="how-step">
            <div className="step-number">2</div>
            <h3>Analyze</h3>
            <p>We parse your structure, dependencies, and complexity metrics instantly.</p>
          </div>
          <div className="how-step">
            <div className="step-number">3</div>
            <h3>Explore</h3>
            <p>Navigate interactive diagrams, graphs, heatmaps, and scorecards.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to see your codebase clearly?</h2>
        <p>No signup required. Paste your code and get instant insights.</p>
        <Link to="/app" className="btn btn-primary">
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer className="app-footer">
        CodeAtlas -- Codebase Intelligence Platform.
        Built with React, TypeScript, and Vite.
      </footer>
    </div>
  );
}
