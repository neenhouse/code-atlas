// Tech debt scoring engine

import type { AnalysisResult } from './mockData';

export type Grade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface ScoreBreakdown {
  category: string;
  score: number; // 0-100 (0 = no debt, 100 = critical)
  weight: number;
  findings: string[];
  recommendation: string;
}

export interface DebtReport {
  overallScore: number;
  grade: Grade;
  breakdowns: ScoreBreakdown[];
}

function scoreToGrade(score: number): Grade {
  if (score <= 20) return 'A';
  if (score <= 40) return 'B';
  if (score <= 60) return 'C';
  if (score <= 80) return 'D';
  return 'F';
}

export function calculateDebtScore(analysis: AnalysisResult): DebtReport {
  const breakdowns: ScoreBreakdown[] = [];

  // 1. Dependency count
  const depCount = analysis.dependencies.filter(d => !d.isDev).length;
  const depScore = Math.min(100, Math.round((depCount / 20) * 100));
  breakdowns.push({
    category: 'Dependency Count',
    score: depScore,
    weight: 0.2,
    findings: [
      `${depCount} production dependencies`,
      depCount > 15 ? 'High dependency count increases attack surface' : 'Dependency count is within acceptable range',
    ],
    recommendation: depCount > 15
      ? 'Audit dependencies and remove unused packages. Consider replacing multiple small utilities with a single library.'
      : 'Dependency count is healthy. Continue periodic audits.',
  });

  // 2. Outdated dependencies
  const outdatedDeps = analysis.dependencies.filter(d => d.isOutdated);
  const outdatedScore = Math.min(100, Math.round((outdatedDeps.length / Math.max(1, analysis.dependencies.length)) * 200));
  breakdowns.push({
    category: 'Outdated Dependencies',
    score: outdatedScore,
    weight: 0.2,
    findings: [
      `${outdatedDeps.length} outdated dependencies found`,
      ...outdatedDeps.slice(0, 5).map(d => `${d.name}@${d.version} needs update`),
    ],
    recommendation: outdatedDeps.length > 3
      ? 'Run dependency updates weekly. Consider using Dependabot or Renovate for automated PRs.'
      : 'Most dependencies are current. Keep up the good maintenance.',
  });

  // 3. File count / project size
  const fileScore = Math.min(100, Math.round((analysis.totalFiles / 80) * 100));
  breakdowns.push({
    category: 'Project Size',
    score: fileScore,
    weight: 0.15,
    findings: [
      `${analysis.totalFiles} files, ${analysis.totalLines.toLocaleString()} total lines`,
      analysis.totalFiles > 60 ? 'Large file count may indicate need for modularization' : 'Project size is manageable',
    ],
    recommendation: analysis.totalFiles > 60
      ? 'Consider splitting into packages/modules. Extract shared utilities into separate libraries.'
      : 'Project size is well-managed.',
  });

  // 4. Largest file complexity
  const sortedByComplexity = [...analysis.files].sort((a, b) => b.complexity - a.complexity);
  const topComplex = sortedByComplexity.slice(0, 5);
  const avgComplexity = analysis.files.length > 0
    ? analysis.files.reduce((sum, f) => sum + f.complexity, 0) / analysis.files.length
    : 0;
  const complexityScore = Math.min(100, Math.round(avgComplexity * 1.5));
  breakdowns.push({
    category: 'Code Complexity',
    score: complexityScore,
    weight: 0.25,
    findings: [
      `Average complexity: ${avgComplexity.toFixed(1)}/100`,
      ...topComplex.map(f => `${f.path}: complexity ${f.complexity}/100 (${f.size} LOC)`),
    ],
    recommendation: avgComplexity > 40
      ? 'Refactor high-complexity files. Break large functions into smaller, testable units. Prioritize the top 5 hotspots.'
      : 'Complexity levels are reasonable. Monitor hotspots during code review.',
  });

  // 5. Test coverage (mock)
  const testFiles = analysis.files.filter(f => f.path.includes('test'));
  const sourceFiles = analysis.files.filter(f => !f.path.includes('test'));
  const coverageRatio = sourceFiles.length > 0 ? testFiles.length / sourceFiles.length : 0;
  const mockCoverage = Math.min(100, Math.round(coverageRatio * 150)); // scaled
  const testScore = Math.max(0, 100 - mockCoverage);
  breakdowns.push({
    category: 'Test Coverage',
    score: testScore,
    weight: 0.2,
    findings: [
      `${testFiles.length} test files for ${sourceFiles.length} source files`,
      `Estimated coverage: ~${mockCoverage}%`,
      mockCoverage < 50 ? 'Critical: test coverage below 50%' : 'Coverage meets minimum threshold',
    ],
    recommendation: mockCoverage < 60
      ? 'Increase test coverage. Focus on critical paths: auth, API routes, and form validation. Aim for 80% coverage.'
      : 'Test coverage is adequate. Maintain coverage as new features are added.',
  });

  // Overall weighted score
  const overallScore = Math.round(
    breakdowns.reduce((sum, b) => sum + b.score * b.weight, 0)
  );

  return {
    overallScore,
    grade: scoreToGrade(overallScore),
    breakdowns,
  };
}
