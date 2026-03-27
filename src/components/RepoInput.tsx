import { useState } from 'react';
import { MOCK_PACKAGE_JSON, MOCK_FILE_TREE } from '../lib/mockData';
import type { AnalysisResult } from '../lib/mockData';
import { analyzeInput } from '../lib/parser';

interface RepoInputProps {
  onAnalyze: (result: AnalysisResult) => void;
}

export default function RepoInput({ onAnalyze }: RepoInputProps) {
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState<{
    deps: number;
    files: number;
    fileTypes: Record<string, number>;
  } | null>(null);

  const handleInputChange = (value: string) => {
    setInput(value);
    if (value.trim()) {
      const result = analyzeInput(value);
      setPreview({
        deps: result.dependencies.length,
        files: result.files.length,
        fileTypes: result.fileCountByType,
      });
    } else {
      setPreview(null);
    }
  };

  const loadSample = (type: 'package' | 'tree' | 'both') => {
    let sample = '';
    if (type === 'package') sample = MOCK_PACKAGE_JSON;
    else if (type === 'tree') sample = MOCK_FILE_TREE;
    else sample = MOCK_PACKAGE_JSON + '\n\n---\n\n' + MOCK_FILE_TREE;
    setInput(sample);
    handleInputChange(sample);
  };

  const handleAnalyze = () => {
    if (!input.trim()) return;
    const result = analyzeInput(input);
    onAnalyze(result);
  };

  return (
    <div className="repo-input">
      <h2>Paste Your Code</h2>
      <p className="description">
        Paste a <code>package.json</code> or file tree below to analyze your project structure,
        dependencies, and complexity.
      </p>

      <div className="sample-btns">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => loadSample('package')}
        >
          Load Sample package.json
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => loadSample('tree')}
        >
          Load Sample File Tree
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => loadSample('both')}
        >
          Load Both
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={'Paste package.json contents:\n{\n  "name": "my-app",\n  "dependencies": { ... }\n}\n\nOr paste a file tree:\nsrc/\n  components/\n    Button.tsx\n    Header.tsx\n  pages/\n    index.tsx'}
        spellCheck={false}
      />

      {preview && (
        <div className="input-stats">
          {preview.deps > 0 && (
            <div className="input-stat">
              <div className="label">Dependencies</div>
              <div className="value">{preview.deps}</div>
            </div>
          )}
          {preview.files > 0 && (
            <div className="input-stat">
              <div className="label">Files</div>
              <div className="value">{preview.files}</div>
            </div>
          )}
          {Object.entries(preview.fileTypes).slice(0, 4).map(([ext, count]) => (
            <div className="input-stat" key={ext}>
              <div className="label">.{ext} files</div>
              <div className="value">{count}</div>
            </div>
          ))}
        </div>
      )}

      <div className="actions">
        <button
          className="btn btn-primary"
          onClick={handleAnalyze}
          disabled={!input.trim()}
        >
          Analyze
        </button>
        {input.trim() && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { setInput(''); setPreview(null); }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
