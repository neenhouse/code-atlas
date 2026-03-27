import { useMemo, useState } from 'react';
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

const CATEGORY_COLORS: Record<string, string> = {
  framework: '#3b82f6',
  utility: '#22c55e',
  dev: '#6b7280',
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
        const minRadius = 12;
        const maxRadius = 36;
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

  const svgWidth = 700;
  const svgHeight = 500;

  return (
    <div className="dep-graph">
      <h2>Dependency Graph</h2>
      <p className="subtitle">
        {analysis.dependencies.length} total packages --
        sized by install footprint, colored by category
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
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
          >
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
            {/* Center project node */}
            <circle
              cx={svgWidth / 2}
              cy={svgHeight / 2}
              r={24}
              fill="var(--accent)"
              fillOpacity={0.2}
              stroke="var(--accent)"
              strokeWidth={2}
            />
            <text
              x={svgWidth / 2}
              y={svgHeight / 2 + 4}
              textAnchor="middle"
              fill="var(--accent-light)"
              fontSize={10}
              fontWeight={600}
            >
              {analysis.projectName.length > 12
                ? analysis.projectName.slice(0, 12) + '...'
                : analysis.projectName}
            </text>

            {/* Edges from center to nodes */}
            {nodes.map((node) => (
              <line
                key={`edge-${node.dep.name}`}
                x1={svgWidth / 2}
                y1={svgHeight / 2}
                x2={node.x}
                y2={node.y}
                stroke={CATEGORY_COLORS[node.dep.category] ?? '#6b7280'}
                strokeWidth={hoveredNode === node.dep.name ? 2 : 0.5}
                strokeOpacity={hoveredNode === node.dep.name ? 0.8 : 0.2}
              />
            ))}

            {/* Dependency nodes */}
            {nodes.map((node) => {
              const isHovered = hoveredNode === node.dep.name;
              const color = CATEGORY_COLORS[node.dep.category] ?? '#6b7280';
              return (
                <g
                  key={node.dep.name}
                  onMouseEnter={() => setHoveredNode(node.dep.name)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius}
                    fill={color}
                    fillOpacity={isHovered ? 0.4 : 0.15}
                    stroke={color}
                    strokeWidth={isHovered ? 2 : 1}
                    strokeOpacity={isHovered ? 1 : 0.5}
                  />
                  {node.dep.isOutdated && (
                    <circle
                      cx={node.x + node.radius * 0.6}
                      cy={node.y - node.radius * 0.6}
                      r={4}
                      fill="var(--viz-yellow)"
                    />
                  )}
                  <text
                    x={node.x}
                    y={node.y + 3}
                    textAnchor="middle"
                    fill={isHovered ? 'var(--text-primary)' : color}
                    fontSize={node.radius > 20 ? 10 : 8}
                    fontWeight={isHovered ? 600 : 400}
                  >
                    {node.dep.name.replace(/^@.*\//, '').slice(0, 10)}
                  </text>
                  {isHovered && (
                    <text
                      x={node.x}
                      y={node.y + 16}
                      textAnchor="middle"
                      fill="var(--text-secondary)"
                      fontSize={9}
                    >
                      {node.dep.version} / {(node.dep.estimatedSize / 1000).toFixed(1)}MB
                    </text>
                  )}
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
                    onMouseLeave={() => setHoveredNode(null)}
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
    </div>
  );
}
