import { useMemo } from 'react';
import type { AnalysisResult } from '../lib/mockData';
import { calculateDebtScore, type Grade } from '../lib/scoring';

interface DebtScoreProps {
  analysis: AnalysisResult;
}

const GRADE_COLORS: Record<Grade, string> = {
  A: '#22c55e',
  B: '#84cc16',
  C: '#eab308',
  D: '#f97316',
  F: '#ef4444',
};

const GRADE_LABELS: Record<Grade, string> = {
  A: 'Excellent',
  B: 'Good',
  C: 'Moderate',
  D: 'Concerning',
  F: 'Critical',
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Dependency Count': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="5" r="3" /><circle cx="5" cy="19" r="3" /><circle cx="19" cy="19" r="3" />
      <line x1="12" y1="8" x2="5" y2="16" /><line x1="12" y1="8" x2="19" y2="16" />
    </svg>
  ),
  'Outdated Dependencies': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  'Project Size': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
      <polyline points="13,2 13,9 20,9" />
    </svg>
  ),
  'Code Complexity': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="16,18 22,12 16,6" /><polyline points="8,6 2,12 8,18" />
    </svg>
  ),
  'Test Coverage': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9,12 11,14 15,10" />
    </svg>
  ),
};

function getBarColor(score: number): string {
  if (score <= 20) return '#22c55e';
  if (score <= 40) return '#84cc16';
  if (score <= 60) return '#eab308';
  if (score <= 80) return '#f97316';
  return '#ef4444';
}

export default function DebtScore({ analysis }: DebtScoreProps) {
  const report = useMemo(() => calculateDebtScore(analysis), [analysis]);
  const gradeColor = GRADE_COLORS[report.grade];

  // Calculate SVG ring progress
  const circumference = 2 * Math.PI * 62;
  const progress = ((100 - report.overallScore) / 100) * circumference;

  return (
    <div className="debt-score">
      <div className="debt-overall" style={{ '--ring-color': gradeColor } as React.CSSProperties}>
        {/* SVG ring gauge */}
        <div className="grade-ring">
          <svg width="140" height="140" viewBox="0 0 140 140" style={{ position: 'absolute', inset: 0 }}>
            {/* Background ring */}
            <circle
              cx="70"
              cy="70"
              r="62"
              fill="none"
              stroke="var(--border-primary)"
              strokeWidth="5"
            />
            {/* Progress ring */}
            <circle
              cx="70"
              cy="70"
              r="62"
              fill="none"
              stroke={gradeColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              transform="rotate(-90 70 70)"
              style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.22, 1, 0.36, 1)' }}
            />
          </svg>
          <span className="grade-letter" style={{ color: gradeColor }}>
            {report.grade}
          </span>
        </div>
        <div className="grade-label">Overall Health</div>
        <div className="grade-score" style={{ color: gradeColor }}>
          {report.overallScore}/100 debt
        </div>
        <p style={{
          marginTop: 14,
          fontSize: 13,
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          maxWidth: 220,
        }}>
          {GRADE_LABELS[report.grade]} --{' '}
          {report.grade === 'A' && 'Your codebase is well-maintained.'}
          {report.grade === 'B' && 'Minor improvements recommended.'}
          {report.grade === 'C' && 'Several areas need attention.'}
          {report.grade === 'D' && 'Significant debt accumulation.'}
          {report.grade === 'F' && 'Immediate action required.'}
        </p>
      </div>

      <div className="debt-breakdowns">
        {report.breakdowns.map((breakdown) => {
          const barColor = getBarColor(breakdown.score);
          return (
            <div key={breakdown.category} className="debt-category-card">
              <div className="debt-category-header">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: barColor, opacity: 0.8 }}>
                    {CATEGORY_ICONS[breakdown.category]}
                  </span>
                  {breakdown.category}
                </h3>
                <span
                  className="score-badge"
                  style={{
                    background: barColor + '18',
                    color: barColor,
                    border: `1px solid ${barColor}35`,
                  }}
                >
                  {breakdown.score}/100
                </span>
              </div>

              <div className="debt-bar">
                <div
                  className="debt-bar-fill"
                  style={{
                    width: `${breakdown.score}%`,
                    background: `linear-gradient(90deg, ${barColor}dd, ${barColor})`,
                  }}
                />
              </div>

              <ul className="debt-findings">
                {breakdown.findings.map((finding, i) => (
                  <li key={i}>{finding}</li>
                ))}
              </ul>

              <div className="debt-recommendation">
                <strong style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.8 }}>
                  Recommendation
                </strong>
                <br />
                {breakdown.recommendation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
