import { useMemo, useState } from 'react';
import type { AnalysisResult } from '../lib/mockData';

interface ArchDiagramProps {
  analysis: AnalysisResult;
}

interface ModuleBox {
  id: string;
  label: string;
  fileCount: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  layer: string;
}

interface Connection {
  from: string;
  to: string;
  strength: number;
}

const LAYER_COLORS: Record<string, string> = {
  pages: '#3b82f6',
  app: '#3b82f6',
  components: '#22c55e',
  hooks: '#a855f7',
  lib: '#f97316',
  types: '#06b6d4',
  api: '#ef4444',
  tests: '#64748b',
  public: '#eab308',
  styles: '#ec4899',
};

// Known inter-layer dependencies
const LAYER_CONNECTIONS: [string, string][] = [
  ['pages', 'components'],
  ['pages', 'hooks'],
  ['pages', 'lib'],
  ['app', 'components'],
  ['app', 'hooks'],
  ['app', 'lib'],
  ['components', 'hooks'],
  ['components', 'lib'],
  ['components', 'types'],
  ['hooks', 'lib'],
  ['hooks', 'types'],
  ['lib', 'types'],
  ['api', 'lib'],
  ['api', 'types'],
  ['tests', 'components'],
  ['tests', 'hooks'],
  ['tests', 'lib'],
];

function getLayerForDir(dir: string): string {
  const parts = dir.split('/');
  for (const part of parts) {
    const lower = part.toLowerCase();
    if (lower === 'api' || lower === 'routes') return 'api';
    if (lower === 'components' || lower === 'ui' || lower === 'layout' || lower === 'forms' || lower === 'features' || lower === 'sections') return 'components';
    if (lower === 'pages' || lower === 'app') return 'app';
    if (lower === 'hooks') return 'hooks';
    if (lower === 'lib' || lower === 'utils' || lower === 'helpers') return 'lib';
    if (lower === 'types') return 'types';
    if (lower === 'tests' || lower === 'test' || lower === '__tests__') return 'tests';
    if (lower === 'public' || lower === 'assets' || lower === 'images') return 'public';
    if (lower === 'styles' || lower === 'css') return 'styles';
  }
  return 'lib';
}

export default function ArchDiagram({ analysis }: ArchDiagramProps) {
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  const { modules, connections } = useMemo(() => {
    // Group directories into logical modules
    const dirGroups: Record<string, { dirs: Set<string>; files: string[]; layer: string }> = {};

    for (const [dir, files] of Object.entries(analysis.directoryStructure)) {
      const layer = getLayerForDir(dir);
      if (!dirGroups[layer]) {
        dirGroups[layer] = { dirs: new Set(), files: [], layer };
      }
      dirGroups[layer].dirs.add(dir);
      dirGroups[layer].files.push(...files);
    }

    // Layout modules in rows
    const layerOrder = ['app', 'pages', 'components', 'hooks', 'lib', 'types', 'api', 'tests', 'public', 'styles'];
    const sortedLayers = Object.keys(dirGroups).sort(
      (a, b) => (layerOrder.indexOf(a) === -1 ? 99 : layerOrder.indexOf(a)) -
                (layerOrder.indexOf(b) === -1 ? 99 : layerOrder.indexOf(b))
    );

    const svgWidth = 800;
    const boxPadding = 24;
    const colCount = 3;
    const colWidth = (svgWidth - boxPadding * 2) / colCount;
    const boxWidth = colWidth - 24;
    const boxHeight = 88;
    const rowGap = 28;
    const startY = 40;

    const mods: ModuleBox[] = sortedLayers.map((layer, i) => {
      const group = dirGroups[layer];
      const col = i % colCount;
      const row = Math.floor(i / colCount);
      return {
        id: layer,
        label: layer.charAt(0).toUpperCase() + layer.slice(1),
        fileCount: group.files.length,
        x: boxPadding + col * colWidth + 12,
        y: startY + row * (boxHeight + rowGap),
        width: boxWidth,
        height: boxHeight,
        color: LAYER_COLORS[layer] ?? '#64748b',
        layer,
      };
    });

    // Build connections from known layer relationships
    const existingLayers = new Set(sortedLayers);
    const conns: Connection[] = [];
    for (const [from, to] of LAYER_CONNECTIONS) {
      if (existingLayers.has(from) && existingLayers.has(to)) {
        // Deterministic strength based on layer name hash
        const hash = (from.length * 7 + to.length * 13) % 4;
        conns.push({ from, to, strength: 1 + hash });
      }
    }

    return { modules: mods, connections: conns };
  }, [analysis]);

  const svgHeight = Math.max(500, Math.ceil(modules.length / 3) * 116 + 80);

  const getModuleCenter = (id: string) => {
    const mod = modules.find(m => m.id === id);
    if (!mod) return { x: 0, y: 0 };
    return { x: mod.x + mod.width / 2, y: mod.y + mod.height / 2 };
  };

  return (
    <div className="arch-diagram">
      <h2>Architecture Diagram</h2>
      <p className="subtitle">
        Module structure of <strong>{analysis.projectName}</strong> --{' '}
        {modules.length} logical modules, {analysis.totalFiles} files
      </p>

      <svg
        className="arch-svg"
        viewBox={`0 0 800 ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="var(--text-muted)" opacity="0.4" />
          </marker>
          {/* Glow filter for hovered modules */}
          <filter id="moduleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
            <feFlood floodColor="var(--accent)" floodOpacity="0.15" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connections */}
        {connections.map((conn, i) => {
          const from = getModuleCenter(conn.from);
          const to = getModuleCenter(conn.to);
          const isHighlighted = hoveredModule === conn.from || hoveredModule === conn.to;
          // Calculate control point for curved connection
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const offset = 20;
          const cx = midX - dy * offset / Math.sqrt(dx * dx + dy * dy + 1);
          const cy = midY + dx * offset / Math.sqrt(dx * dx + dy * dy + 1);
          return (
            <path
              key={i}
              d={`M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`}
              fill="none"
              stroke={isHighlighted ? 'var(--accent)' : 'var(--border-secondary)'}
              strokeWidth={isHighlighted ? 1.5 : 0.8}
              strokeOpacity={isHighlighted ? 0.6 : 0.25}
              markerEnd="url(#arrowhead)"
            />
          );
        })}

        {/* Module boxes */}
        {modules.map((mod) => {
          const isHovered = hoveredModule === mod.id;
          return (
            <g
              key={mod.id}
              onMouseEnter={() => setHoveredModule(mod.id)}
              onMouseLeave={() => setHoveredModule(null)}
              style={{ cursor: 'pointer' }}
              filter={isHovered ? 'url(#moduleGlow)' : undefined}
            >
              {/* Background fill */}
              <rect
                x={mod.x}
                y={mod.y}
                width={mod.width}
                height={mod.height}
                rx={10}
                fill={mod.color}
                fillOpacity={isHovered ? 0.15 : 0.08}
                stroke={mod.color}
                strokeWidth={isHovered ? 2 : 1.5}
                strokeOpacity={isHovered ? 0.8 : 0.35}
              />
              {/* Top accent bar */}
              <rect
                x={mod.x + 1}
                y={mod.y + 1}
                width={mod.width - 2}
                height={3}
                rx={2}
                fill={mod.color}
                fillOpacity={isHovered ? 0.5 : 0.25}
              />
              {/* Label */}
              <text
                x={mod.x + 16}
                y={mod.y + 30}
                fill={isHovered ? '#fff' : mod.color}
                fontSize={15}
                fontWeight={600}
                fontFamily="var(--font-sans)"
              >
                {mod.label}
              </text>
              {/* File count */}
              <text
                x={mod.x + 16}
                y={mod.y + 50}
                fill="var(--text-secondary)"
                fontSize={12}
                fontFamily="var(--font-sans)"
              >
                {mod.fileCount} file{mod.fileCount !== 1 ? 's' : ''}
              </text>
              {/* Mini bar chart showing relative file count */}
              <rect
                x={mod.x + 16}
                y={mod.y + 62}
                width={Math.min(mod.width - 32, mod.fileCount * 6)}
                height={4}
                rx={2}
                fill={mod.color}
                fillOpacity={isHovered ? 0.6 : 0.35}
              />
              <rect
                x={mod.x + 16}
                y={mod.y + 62}
                width={mod.width - 32}
                height={4}
                rx={2}
                fill={mod.color}
                fillOpacity={0.08}
              />
            </g>
          );
        })}
      </svg>

      <div className="arch-legend">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className="arch-legend-item"
            onMouseEnter={() => setHoveredModule(mod.id)}
            onMouseLeave={() => setHoveredModule(null)}
            style={{
              cursor: 'pointer',
              opacity: hoveredModule && hoveredModule !== mod.id ? 0.5 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            <div className="swatch" style={{ background: mod.color }} />
            {mod.label}
          </div>
        ))}
      </div>
    </div>
  );
}
