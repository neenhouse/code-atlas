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
  requiresAnalysis: boolean;
}

const TABS: Tab[] = [
  { id: 'input', label: 'Repo Input', requiresAnalysis: false },
  { id: 'architecture', label: 'Architecture', requiresAnalysis: true },
  { id: 'dependencies', label: 'Dependencies', requiresAnalysis: true },
  { id: 'complexity', label: 'Complexity', requiresAnalysis: true },
  { id: 'debt', label: 'Tech Debt', requiresAnalysis: true },
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <h1>Analysis Dashboard</h1>
        {!analysis && (
          <button className="btn btn-secondary btn-sm" onClick={loadDemo}>
            Load Demo Project
          </button>
        )}
        {analysis && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
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
              style={{ opacity: disabled ? 0.4 : 1 }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div>
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
