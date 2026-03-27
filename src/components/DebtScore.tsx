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

  return (
    <div className="debt-score">
      <div className="debt-overall">
        <div
          className="grade-ring"
          style={{ '--ring-color': gradeColor } as React.CSSProperties}
        >
          <span className="grade-letter" style={{ color: gradeColor }}>
            {report.grade}
          </span>
        </div>
        <div className="grade-label">Overall Health</div>
        <div className="grade-score" style={{ color: gradeColor }}>
          {report.overallScore}/100 debt
        </div>
        <p style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
          {GRADE_LABELS[report.grade]} --
          {report.grade === 'A' && ' Your codebase is well-maintained.'}
          {report.grade === 'B' && ' Minor improvements recommended.'}
          {report.grade === 'C' && ' Several areas need attention.'}
          {report.grade === 'D' && ' Significant debt accumulation.'}
          {report.grade === 'F' && ' Immediate action required.'}
        </p>
      </div>

      <div className="debt-breakdowns">
        {report.breakdowns.map((breakdown) => {
          const barColor = getBarColor(breakdown.score);
          return (
            <div key={breakdown.category} className="debt-category-card">
              <div className="debt-category-header">
                <h3>{breakdown.category}</h3>
                <span
                  className="score-badge"
                  style={{
                    background: barColor + '20',
                    color: barColor,
                    border: `1px solid ${barColor}40`,
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
                    background: barColor,
                  }}
                />
              </div>

              <ul className="debt-findings">
                {breakdown.findings.map((finding, i) => (
                  <li key={i}>{finding}</li>
                ))}
              </ul>

              <div className="debt-recommendation">
                {breakdown.recommendation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
