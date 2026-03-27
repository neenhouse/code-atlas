import { useState, useCallback } from 'react';
import type { AnalysisResult } from '../lib/mockData';
import { buildMockAnalysis } from '../lib/mockData';
import RepoInput from '../components/RepoInput';
import ArchDiagram from '../components/ArchDiagram';
import DepGraph from '../components/DepGraph';
import ComplexityMap from '../components/ComplexityMap';
import DebtScore from '../components/DebtScore';

type TabId = 'input' | 'architecture' | 'dependencies' | 'complexity' | 'debt';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  requiresAnalysis: boolean;
}

const TABS: Tab[] = [
  {
    id: 'input',
    label: 'Repo Input',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
        <polyline points="13,2 13,9 20,9" />
      </svg>
    ),
    requiresAnalysis: false,
  },
  {
    id: 'architecture',
    label: 'Architecture',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="8" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    requiresAnalysis: true,
  },
  {
    id: 'dependencies',
    label: 'Dependencies',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="5" r="3" />
        <circle cx="5" cy="19" r="3" />
        <circle cx="19" cy="19" r="3" />
        <line x1="12" y1="8" x2="5" y2="16" />
        <line x1="12" y1="8" x2="19" y2="16" />
      </svg>
    ),
    requiresAnalysis: true,
  },
  {
    id: 'complexity',
    label: 'Complexity',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <rect x="6" y="6" width="5" height="5" rx="1" />
        <rect x="13" y="6" width="5" height="3" rx="1" />
        <rect x="6" y="13" width="4" height="5" rx="1" />
        <rect x="12" y="11" width="6" height="7" rx="1" />
      </svg>
    ),
    requiresAnalysis: true,
  },
  {
    id: 'debt',
    label: 'Tech Debt',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v9l6 3" />
      </svg>
    ),
    requiresAnalysis: true,
  },
];

export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState<TabId>('input');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleAnalyze = useCallback((result: AnalysisResult) => {
    setAnalysis(result);
    setActiveTab('architecture');
  }, []);

  const loadDemo = useCallback(() => {
    setAnalysis(buildMockAnalysis());
    setActiveTab('architecture');
  }, []);

  return (
    <div className="analysis-page">
      <div className="analysis-header">
        <h1>Analysis Dashboard</h1>
        {!analysis && (
          <button className="btn btn-secondary btn-sm" onClick={loadDemo}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polygon points="5,3 19,12 5,21" />
            </svg>
            Load Demo Project
          </button>
        )}
        {analysis && (
          <div className="analysis-meta">
            <span>
              Analyzing: <strong style={{ color: 'var(--text-primary)' }}>{analysis.projectName}</strong>
              {' -- '}{analysis.totalFiles} files, {analysis.totalLines.toLocaleString()} LOC
            </span>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => { setAnalysis(null); setActiveTab('input'); }}
            >
              New Analysis
            </button>
          </div>
        )}
      </div>

      <nav className="tab-nav">
        {TABS.map((tab) => {
          const disabled = tab.requiresAnalysis && !analysis;
          return (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => !disabled && setActiveTab(tab.id)}
              disabled={disabled}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="tab-content" key={activeTab}>
        {activeTab === 'input' && (
          <RepoInput onAnalyze={handleAnalyze} />
        )}
        {activeTab === 'architecture' && analysis && (
          <ArchDiagram analysis={analysis} />
        )}
        {activeTab === 'dependencies' && analysis && (
          <DepGraph analysis={analysis} />
        )}
        {activeTab === 'complexity' && analysis && (
          <ComplexityMap analysis={analysis} />
        )}
        {activeTab === 'debt' && analysis && (
          <DebtScore analysis={analysis} />
        )}
      </div>
    </div>
  );
}
