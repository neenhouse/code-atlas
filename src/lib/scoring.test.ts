import { describe, it, expect } from 'vitest';
import { calculateDebtScore } from './scoring';
import { buildMockAnalysis } from './mockData';
import type { AnalysisResult } from './mockData';

describe('calculateDebtScore', () => {
  it('produces a valid grade for mock data', () => {
    const analysis = buildMockAnalysis();
    const report = calculateDebtScore(analysis);

    expect(['A', 'B', 'C', 'D', 'F']).toContain(report.grade);
    expect(report.overallScore).toBeGreaterThanOrEqual(0);
    expect(report.overallScore).toBeLessThanOrEqual(100);
  });

  it('returns 5 breakdown categories', () => {
    const analysis = buildMockAnalysis();
    const report = calculateDebtScore(analysis);

    expect(report.breakdowns).toHaveLength(5);
    const categories = report.breakdowns.map(b => b.category);
    expect(categories).toContain('Dependency Count');
    expect(categories).toContain('Outdated Dependencies');
    expect(categories).toContain('Project Size');
    expect(categories).toContain('Code Complexity');
    expect(categories).toContain('Test Coverage');
  });

  it('scores a minimal project as healthy', () => {
    const minimal: AnalysisResult = {
      projectName: 'tiny',
      totalFiles: 3,
      totalLines: 50,
      files: [
        { path: 'src/index.ts', type: 'file', extension: 'ts', size: 30, complexity: 10, lastModified: '2024-01-01' },
        { path: 'src/utils.ts', type: 'file', extension: 'ts', size: 20, complexity: 5, lastModified: '2024-01-01' },
        { path: 'tests/index.test.ts', type: 'file', extension: 'ts', size: 25, complexity: 5, lastModified: '2024-01-01' },
      ],
      dependencies: [
        { name: 'typescript', version: '5.4.0', category: 'dev', estimatedSize: 12000, isDev: true, isOutdated: false },
      ],
      fileCountByType: { ts: 3 },
      directoryStructure: {
        'src': ['index.ts', 'utils.ts'],
        'tests': ['index.test.ts'],
      },
    };

    const report = calculateDebtScore(minimal);
    // With 0 production deps, low complexity, good test ratio, this should be healthy
    expect(report.overallScore).toBeLessThan(50);
    expect(['A', 'B']).toContain(report.grade);
  });

  it('each breakdown score is between 0 and 100', () => {
    const analysis = buildMockAnalysis();
    const report = calculateDebtScore(analysis);

    for (const breakdown of report.breakdowns) {
      expect(breakdown.score).toBeGreaterThanOrEqual(0);
      expect(breakdown.score).toBeLessThanOrEqual(100);
      expect(breakdown.weight).toBeGreaterThan(0);
      expect(breakdown.findings.length).toBeGreaterThan(0);
      expect(breakdown.recommendation.length).toBeGreaterThan(0);
    }
  });
});
