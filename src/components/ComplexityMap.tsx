import { useMemo, useState, useRef, useCallback } from 'react';
import type { AnalysisResult, FileEntry } from '../lib/mockData';

interface ComplexityMapProps {
  analysis: AnalysisResult;
}

interface TreemapRect {
  file: FileEntry;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface TooltipData {
  file: FileEntry;
  x: number;
  y: number;
}

function complexityToColor(complexity: number): string {
  if (complexity <= 15) return '#22c55e';
  if (complexity <= 30) return '#4ade80';
  if (complexity <= 45) return '#a3e635';
  if (complexity <= 60) return '#eab308';
  if (complexity <= 75) return '#f97316';
  if (complexity <= 90) return '#ef4444';
  return '#dc2626';
}

function complexityLabel(complexity: number): string {
  if (complexity <= 20) return 'Low';
  if (complexity <= 40) return 'Moderate';
  if (complexity <= 60) return 'Medium';
  if (complexity <= 80) return 'High';
  return 'Critical';
}

// Simple squarified treemap layout
function layoutTreemap(
  files: FileEntry[],
  x: number,
  y: number,
  width: number,
  height: number
): TreemapRect[] {
  if (files.length === 0) return [];
  if (files.length === 1) {
    return [{
      file: files[0],
      x, y, width, height,
      color: complexityToColor(files[0].complexity),
    }];
  }

  // Sort by size descending
  const sorted = [...files].sort((a, b) => b.size - a.size);
  const totalSize = sorted.reduce((sum, f) => sum + f.size, 0);

  if (totalSize === 0) return [];

  // Split into two groups
  let leftSize = 0;
  let splitIdx = 0;
  const halfSize = totalSize / 2;

  for (let i = 0; i < sorted.length; i++) {
    if (leftSize + sorted[i].size > halfSize && i > 0) {
      splitIdx = i;
      break;
    }
    leftSize += sorted[i].size;
    splitIdx = i + 1;
  }

  if (splitIdx === 0) splitIdx = 1;
  if (splitIdx >= sorted.length) splitIdx = sorted.length - 1;

  const leftFiles = sorted.slice(0, splitIdx);
  const rightFiles = sorted.slice(splitIdx);
  const leftTotal = leftFiles.reduce((sum, f) => sum + f.size, 0);
  const ratio = leftTotal / totalSize;

  const rects: TreemapRect[] = [];

  if (width >= height) {
    // Split horizontally
    const leftWidth = width * ratio;
    rects.push(...layoutTreemap(leftFiles, x, y, leftWidth, height));
    rects.push(...layoutTreemap(rightFiles, x + leftWidth, y, width - leftWidth, height));
  } else {
    // Split vertically
    const topHeight = height * ratio;
    rects.push(...layoutTreemap(leftFiles, x, y, width, topHeight));
    rects.push(...layoutTreemap(rightFiles, x, y + topHeight, width, height - topHeight));
  }

  return rects;
}

export default function ComplexityMap({ analysis }: ComplexityMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const { rects, stats } = useMemo(() => {
    const sourceFiles = analysis.files.filter(f => !f.path.includes('test'));
    const avgComplexity = sourceFiles.length > 0
      ? sourceFiles.reduce((sum, f) => sum + f.complexity, 0) / sourceFiles.length
      : 0;
    const hotspots = sourceFiles.filter(f => f.complexity >= 60).length;
    return {
      rects: layoutTreemap(sourceFiles, 0, 0, 100, 100),
      stats: {
        avgComplexity: Math.round(avgComplexity),
        hotspots,
        totalFiles: sourceFiles.length,
      },
    };
  }, [analysis]);

  const handleMouseMove = useCallback((e: React.MouseEvent, file: FileEntry) => {
    setTooltip({ file, x: e.clientX + 14, y: e.clientY - 10 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  return (
    <div className="complexity-map">
      <h2>Complexity Heatmap</h2>
      <p className="subtitle">
        File sizes as area, complexity as color intensity.
        Hover for details.{' '}
        <span style={{ color: 'var(--viz-red)' }}>Red</span> = high complexity,{' '}
        <span style={{ color: 'var(--viz-green)' }}>green</span> = simple.
        {stats.hotspots > 0 && (
          <span style={{ marginLeft: 8, color: 'var(--viz-orange)' }}>
            {stats.hotspots} hotspot{stats.hotspots !== 1 ? 's' : ''} detected
          </span>
        )}
      </p>

      <div
        ref={containerRef}
        className="treemap-container"
        style={{ height: 500, position: 'relative' }}
      >
        {rects.map((rect) => {
          const showLabel = rect.width > 6 && rect.height > 4;
          const fileName = rect.file.path.split('/').pop() ?? '';
          return (
            <div
              key={rect.file.path}
              className="treemap-cell"
              style={{
                left: `${rect.x}%`,
                top: `${rect.y}%`,
                width: `${rect.width}%`,
                height: `${rect.height}%`,
                background: rect.color,
              }}
              onMouseMove={(e) => handleMouseMove(e, rect.file)}
              onMouseLeave={handleMouseLeave}
            >
              {showLabel && (
                <span className="cell-label">
                  {fileName.length > 15 ? fileName.slice(0, 13) + '..' : fileName}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {tooltip && (
        <div
          className="treemap-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="tt-path">{tooltip.file.path}</div>
          <div className="tt-row">
            <span>Lines of code</span>
            <span className="tt-value">{tooltip.file.size}</span>
          </div>
          <div className="tt-row">
            <span>Complexity</span>
            <span className="tt-value" style={{ color: complexityToColor(tooltip.file.complexity) }}>
              {tooltip.file.complexity}/100 ({complexityLabel(tooltip.file.complexity)})
            </span>
          </div>
          <div className="tt-row">
            <span>Extension</span>
            <span className="tt-value">.{tooltip.file.extension}</span>
          </div>
          <div className="tt-row">
            <span>Last modified</span>
            <span className="tt-value">{tooltip.file.lastModified}</span>
          </div>
        </div>
      )}

      <div className="heatmap-legend">
        <span>Simple</span>
        <div className="heatmap-gradient" />
        <span>Complex</span>
        <span style={{ marginLeft: 16, color: 'var(--text-muted)' }}>
          {stats.totalFiles} files, {analysis.totalLines.toLocaleString()} LOC,{' '}
          avg complexity {stats.avgComplexity}/100
        </span>
      </div>
    </div>
  );
}
