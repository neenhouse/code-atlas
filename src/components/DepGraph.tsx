import { useMemo, useState, useCallback } from 'react';
import type { AnalysisResult, DependencyEntry } from '../lib/mockData';

interface DepGraphProps {
  analysis: AnalysisResult;
}

interface NodePosition {
  dep: DependencyEntry;
  x: number;
  y: number;
  radius: number;
}

interface TooltipState {
  dep: DependencyEntry;
  x: number;
  y: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  framework: '#3b82f6',
  utility: '#22c55e',
  dev: '#64748b',
  styling: '#a855f7',
  testing: '#f97316',
};

const CATEGORY_LABELS: Record<string, string> = {
  framework: 'Framework',
  utility: 'Utility',
  dev: 'Dev Tools',
  styling: 'Styling',
  testing: 'Testing',
};

export default function DepGraph({ analysis }: DepGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const { nodes, categoryGroups } = useMemo(() => {
    const deps = filter === 'all'
      ? analysis.dependencies
      : analysis.dependencies.filter(d => d.category === filter);

    // Layout: force-directed-like positioning using categories
    const categories = [...new Set(deps.map(d => d.category))];
    const svgWidth = 700;
    const svgHeight = 500;
    const centerX = svgWidth / 2;
    const centerY = svgHeight / 2;

    const positions: NodePosition[] = [];
    const categoryAngleStep = (2 * Math.PI) / Math.max(1, categories.length);

    categories.forEach((cat, catIdx) => {
      const catDeps = deps.filter(d => d.category === cat);
      const catAngle = categoryAngleStep * catIdx - Math.PI / 2;
      const catRadius = 160;
      const catCenterX = centerX + Math.cos(catAngle) * catRadius;
      const catCenterY = centerY + Math.sin(catAngle) * catRadius;

      catDeps.forEach((dep, depIdx) => {
        const depAngle = (2 * Math.PI / Math.max(1, catDeps.length)) * depIdx;
        const spreadRadius = 40 + catDeps.length * 8;
        const x = catCenterX + Math.cos(depAngle) * spreadRadius;
        const y = catCenterY + Math.sin(depAngle) * spreadRadius;
        const minRadius = 14;
        const maxRadius = 38;
        const sizeNorm = Math.min(1, dep.estimatedSize / 8000);
        const radius = minRadius + sizeNorm * (maxRadius - minRadius);

        positions.push({ dep, x, y, radius });
      });
    });

    // Group by category for sidebar
    const groups: Record<string, DependencyEntry[]> = {};
    for (const dep of analysis.dependencies) {
      if (!groups[dep.category]) groups[dep.category] = [];
      groups[dep.category].push(dep);
    }

    return { nodes: positions, categoryGroups: groups };
  }, [analysis, filter]);

  const handleNodeMouseMove = useCallback((e: React.MouseEvent, dep: DependencyEntry) => {
    setHoveredNode(dep.name);
    setTooltip({ dep, x: e.clientX + 14, y: e.clientY - 10 });
  }, []);

  const handleNodeMouseLeave = useCallback(() => {
    setHoveredNode(null);
    setTooltip(null);
  }, []);

  const svgWidth = 700;
  const svgHeight = 500;

  return (
    <div className="dep-graph">
      <h2>Dependency Graph</h2>
      <p className="subtitle">
        {analysis.dependencies.length} total packages --
        sized by install footprint, colored by category
      </p>

      <div className="dep-filter-bar">
        <button
          className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        {Object.keys(CATEGORY_LABELS).map(cat => (
          <button
            key={cat}
            className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(cat)}
            style={filter === cat ? { background: CATEGORY_COLORS[cat] } : undefined}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: CATEGORY_COLORS[cat],
                display: filter === cat ? 'none' : 'inline-block',
              }}
            />
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="dep-graph-container">
        <div className="dep-graph-svg-wrap">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: '100%', height: '100%' }}
          >
            <defs>
              <radialGradient id="centerGlow">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Center glow */}
            <circle
              cx={svgWidth / 2}
              cy={svgHeight / 2}
              r={60}
              fill="url(#centerGlow)"
            />

            {/* Center project node */}
            <circle
              cx={svgWidth / 2}
              cy={svgHeight / 2}
              r={26}
              fill="var(--accent)"
              fillOpacity={0.15}
              stroke="var(--accent)"
              strokeWidth={2}
              strokeOpacity={0.6}
            />
            <text
              x={svgWidth / 2}
              y={svgHeight / 2 + 4}
              textAnchor="middle"
              fill="var(--accent-light)"
              fontSize={10}
              fontWeight={600}
              fontFamily="var(--font-sans)"
            >
              {analysis.projectName.length > 12
                ? analysis.projectName.slice(0, 12) + '...'
                : analysis.projectName}
            </text>

            {/* Edges from center to nodes */}
            {nodes.map((node) => {
              const isHovered = hoveredNode === node.dep.name;
              return (
                <line
                  key={`edge-${node.dep.name}`}
                  x1={svgWidth / 2}
                  y1={svgHeight / 2}
                  x2={node.x}
                  y2={node.y}
                  stroke={CATEGORY_COLORS[node.dep.category] ?? '#64748b'}
                  strokeWidth={isHovered ? 2 : 0.5}
                  strokeOpacity={isHovered ? 0.7 : 0.15}
                  strokeDasharray={isHovered ? 'none' : '2 3'}
                />
              );
            })}

            {/* Dependency nodes */}
            {nodes.map((node) => {
              const isHovered = hoveredNode === node.dep.name;
              const color = CATEGORY_COLORS[node.dep.category] ?? '#64748b';
              return (
                <g
                  key={node.dep.name}
                  onMouseMove={(e) => handleNodeMouseMove(e, node.dep)}
                  onMouseLeave={handleNodeMouseLeave}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Glow ring on hover */}
                  {isHovered && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius + 6}
                      fill="none"
                      stroke={color}
                      strokeWidth={1}
                      strokeOpacity={0.3}
                    />
                  )}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius}
                    fill={color}
                    fillOpacity={isHovered ? 0.35 : 0.12}
                    stroke={color}
                    strokeWidth={isHovered ? 2 : 1}
                    strokeOpacity={isHovered ? 1 : 0.4}
                  />
                  {node.dep.isOutdated && (
                    <circle
                      cx={node.x + node.radius * 0.6}
                      cy={node.y - node.radius * 0.6}
                      r={4}
                      fill="var(--viz-yellow)"
                      stroke="var(--bg-surface)"
                      strokeWidth={1.5}
                    />
                  )}
                  <text
                    x={node.x}
                    y={node.y + 3}
                    textAnchor="middle"
                    fill={isHovered ? 'var(--text-primary)' : color}
                    fontSize={node.radius > 22 ? 10 : 8}
                    fontWeight={isHovered ? 600 : 400}
                    fontFamily="var(--font-sans)"
                  >
                    {node.dep.name.replace(/^@.*\//, '').slice(0, 10)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="dep-graph-sidebar">
          {Object.entries(categoryGroups).map(([cat, deps]) => (
            <div key={cat} className="dep-category">
              <h4>
                <span
                  className="dot"
                  style={{ background: CATEGORY_COLORS[cat] }}
                />
                {CATEGORY_LABELS[cat] ?? cat} ({deps.length})
              </h4>
              <ul className="dep-list">
                {deps.map(dep => (
                  <li
                    key={dep.name}
                    onMouseEnter={() => setHoveredNode(dep.name)}
                    onMouseLeave={() => { setHoveredNode(null); setTooltip(null); }}
                    style={{
                      background: hoveredNode === dep.name ? 'var(--bg-hover)' : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <span className="dep-name">{dep.name}</span>
                    <span>
                      <span className="dep-version">{dep.version}</span>
                      {dep.isOutdated && <span className="dep-outdated"> outdated</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Floating tooltip for graph nodes */}
      {tooltip && (
        <div
          className="dep-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="tt-name">
            <span className="dot" style={{ background: CATEGORY_COLORS[tooltip.dep.category] }} />
            {tooltip.dep.name}
          </div>
          <div className="tt-row">
            <span>Version</span>
            <span className="tt-value">{tooltip.dep.version}</span>
          </div>
          <div className="tt-row">
            <span>Category</span>
            <span className="tt-value">{CATEGORY_LABELS[tooltip.dep.category]}</span>
          </div>
          <div className="tt-row">
            <span>Size</span>
            <span className="tt-value">{(tooltip.dep.estimatedSize / 1000).toFixed(1)} MB</span>
          </div>
          {tooltip.dep.isOutdated && (
            <div className="tt-row" style={{ color: 'var(--viz-yellow)' }}>
              <span>Status</span>
              <span style={{ color: 'var(--viz-yellow)', fontWeight: 600 }}>Outdated</span>
            </div>
          )}
          {tooltip.dep.isDev && (
            <div className="tt-row">
              <span>Type</span>
              <span className="tt-value">devDependency</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
