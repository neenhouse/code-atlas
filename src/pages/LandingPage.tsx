import { Link } from 'react-router-dom';

function HeroPreview() {
  const nodes = [
    { label: 'App', x: 350, y: 30, w: 100, color: '#3b82f6' },
    { label: 'Components', x: 140, y: 110, w: 120, color: '#22c55e' },
    { label: 'Hooks', x: 370, y: 110, w: 90, color: '#a855f7' },
    { label: 'API', x: 550, y: 110, w: 80, color: '#ef4444' },
    { label: 'Lib', x: 250, y: 190, w: 80, color: '#f97316' },
    { label: 'Types', x: 450, y: 190, w: 80, color: '#06b6d4' },
  ];

  const edges = [
    [0, 1], [0, 2], [0, 3],
    [1, 2], [1, 4],
    [2, 4], [2, 5],
    [3, 4], [3, 5],
  ];

  return (
    <div className="hero-preview">
      <div className="hero-preview-bar">
        <div className="hero-preview-dot" />
        <div className="hero-preview-dot" />
        <div className="hero-preview-dot" />
        <span className="hero-preview-title">my-nextjs-app / architecture</span>
      </div>
      <div className="hero-preview-body">
        <div className="hero-preview-diagram">
          <svg viewBox="0 0 700 240" width="100%" height="100%">
            {/* Edges */}
            {edges.map(([from, to], i) => (
              <line
                key={i}
                x1={nodes[from].x + nodes[from].w / 2}
                y1={nodes[from].y + 20}
                x2={nodes[to].x + nodes[to].w / 2}
                y2={nodes[to].y + 20}
                stroke={nodes[from].color}
                strokeWidth={1}
                strokeOpacity={0.25}
              />
            ))}
            {/* Nodes */}
            {nodes.map((n, i) => (
              <g key={i}>
                <rect
                  x={n.x}
                  y={n.y}
                  width={n.w}
                  height={40}
                  rx={8}
                  fill={n.color}
                  fillOpacity={0.1}
                  stroke={n.color}
                  strokeWidth={1.5}
                  strokeOpacity={0.4}
                />
                <text
                  x={n.x + n.w / 2}
                  y={n.y + 24}
                  textAnchor="middle"
                  fill={n.color}
                  fontSize={13}
                  fontWeight={600}
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {n.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <div className="hero-preview-stats">
          <div className="hero-stat-card">
            <div className="hero-stat-label">Files</div>
            <div className="hero-stat-value" style={{ color: '#06b6d4' }}>47</div>
            <div className="hero-stat-bar">
              <div className="hero-stat-bar-fill" style={{ width: '60%', background: '#06b6d4' }} />
            </div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-label">Health</div>
            <div className="hero-stat-value" style={{ color: '#22c55e' }}>B+</div>
            <div className="hero-stat-bar">
              <div className="hero-stat-bar-fill" style={{ width: '78%', background: '#22c55e' }} />
            </div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-label">Dependencies</div>
            <div className="hero-stat-value" style={{ color: '#a855f7' }}>24</div>
            <div className="hero-stat-bar">
              <div className="hero-stat-bar-fill" style={{ width: '45%', background: '#a855f7' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero-section">
        <span className="badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <circle cx="4" cy="6" r="2" />
            <circle cx="20" cy="6" r="2" />
            <circle cx="4" cy="18" r="2" />
            <circle cx="20" cy="18" r="2" />
            <line x1="6" y1="6" x2="9" y2="10" />
            <line x1="18" y1="6" x2="15" y2="10" />
            <line x1="6" y1="18" x2="9" y2="14" />
            <line x1="18" y1="18" x2="15" y2="14" />
          </svg>
          Codebase Intelligence Platform
        </span>
        <h1>
          Understand your codebase{' '}
          <span className="gradient-text">in seconds</span>
        </h1>
        <p className="subtitle">
          Paste a repo and get architecture diagrams, dependency graphs,
          complexity hotspots, and tech debt scoring -- instantly.
        </p>
        <div className="hero-cta">
          <Link to="/app" className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Analyze Your Repo
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View on GitHub
          </a>
        </div>
        <HeroPreview />
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-header">
          <h2>Everything you need to understand a codebase</h2>
          <p>From high-level architecture to individual file complexity</p>
        </div>
        <div className="features-grid">
          <div className="feature-card" style={{ '--feature-accent': '#3b82f6' } as React.CSSProperties}>
            <div className="feature-icon" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="7" height="7" rx="2" />
                <rect x="14" y="3" width="7" height="7" rx="2" />
                <rect x="3" y="14" width="7" height="7" rx="2" />
                <rect x="14" y="14" width="7" height="7" rx="2" />
                <line x1="10" y1="6.5" x2="14" y2="6.5" strokeOpacity="0.5" />
                <line x1="6.5" y1="10" x2="6.5" y2="14" strokeOpacity="0.5" />
              </svg>
            </div>
            <h3>Architecture Diagrams</h3>
            <p>
              Auto-generated box diagrams showing module structure, grouped by directory.
              See how your code layers connect at a glance.
            </p>
          </div>

          <div className="feature-card" style={{ '--feature-accent': '#22c55e' } as React.CSSProperties}>
            <div className="feature-icon" style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#22c55e' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="5" r="3" />
                <circle cx="5" cy="19" r="3" />
                <circle cx="19" cy="19" r="3" />
                <line x1="12" y1="8" x2="5" y2="16" />
                <line x1="12" y1="8" x2="19" y2="16" />
                <line x1="8" y1="19" x2="16" y2="19" strokeOpacity="0.4" />
              </svg>
            </div>
            <h3>Dependency Graphs</h3>
            <p>
              Visualize package dependencies as an interactive node graph. Sized by install
              footprint, colored by category.
            </p>
          </div>

          <div className="feature-card" style={{ '--feature-accent': '#ef4444' } as React.CSSProperties}>
            <div className="feature-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="2" y="2" width="20" height="20" rx="3" />
                <rect x="4" y="4" width="8" height="8" rx="1" fill="currentColor" fillOpacity="0.15" />
                <rect x="14" y="4" width="6" height="5" rx="1" fill="currentColor" fillOpacity="0.1" />
                <rect x="4" y="14" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.08" />
                <rect x="12" y="11" width="8" height="9" rx="1" fill="currentColor" fillOpacity="0.2" />
              </svg>
            </div>
            <h3>Complexity Heatmap</h3>
            <p>
              Treemap visualization colored by complexity. Red hotspots jump out immediately.
              Hover to drill into file details.
            </p>
          </div>

          <div className="feature-card" style={{ '--feature-accent': '#eab308' } as React.CSSProperties}>
            <div className="feature-icon" style={{ background: 'rgba(234, 179, 8, 0.12)', color: '#eab308' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v9l6 3" />
                <circle cx="12" cy="12" r="1" fill="currentColor" />
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
            <h3>Paste</h3>
            <p>Drop in your package.json or file tree. No signup, no config, no waiting.</p>
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          Get Started Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="app-footer">
        CodeAtlas -- Codebase Intelligence Platform. Built with React, TypeScript, and Vite.
      </footer>
    </div>
  );
}
