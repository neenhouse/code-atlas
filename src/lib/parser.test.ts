import { describe, it, expect } from 'vitest';
import { parsePackageJson, parseFileTree, analyzeInput } from './parser';

describe('parsePackageJson', () => {
  it('extracts dependencies from a valid package.json', () => {
    const pkg = JSON.stringify({
      name: 'test-app',
      dependencies: {
        react: '^18.2.0',
        axios: '^1.6.0',
      },
      devDependencies: {
        typescript: '^5.3.0',
      },
    });

    const deps = parsePackageJson(pkg);
    expect(deps).toHaveLength(3);

    const react = deps.find(d => d.name === 'react');
    expect(react).toBeDefined();
    expect(react!.isDev).toBe(false);
    expect(react!.category).toBe('framework');

    const ts = deps.find(d => d.name === 'typescript');
    expect(ts).toBeDefined();
    expect(ts!.isDev).toBe(true);
  });

  it('returns empty array for invalid JSON', () => {
    const deps = parsePackageJson('not json');
    expect(deps).toEqual([]);
  });

  it('handles package.json with no dependencies', () => {
    const pkg = JSON.stringify({ name: 'empty-app', version: '1.0.0' });
    const deps = parsePackageJson(pkg);
    expect(deps).toEqual([]);
  });
});

describe('parseFileTree', () => {
  it('parses a simple file tree with indentation', () => {
    const tree = `src/
  components/
    Button.tsx
    Header.tsx
  pages/
    index.tsx`;

    const files = parseFileTree(tree);
    expect(files).toHaveLength(3);

    const button = files.find(f => f.path === 'src/components/Button.tsx');
    expect(button).toBeDefined();
    expect(button!.extension).toBe('tsx');
    expect(button!.type).toBe('file');

    const index = files.find(f => f.path === 'src/pages/index.tsx');
    expect(index).toBeDefined();
  });

  it('returns empty array for empty input', () => {
    const files = parseFileTree('');
    expect(files).toEqual([]);
  });
});

describe('analyzeInput', () => {
  it('detects package.json and extracts dependencies', () => {
    const input = JSON.stringify({
      name: 'my-app',
      dependencies: { react: '^18.0.0', next: '^14.0.0' },
    });

    const result = analyzeInput(input);
    expect(result.projectName).toBe('my-app');
    expect(result.dependencies.length).toBeGreaterThan(0);
  });

  it('computes fileCountByType correctly', () => {
    const tree = `src/
  App.tsx
  utils.ts
  styles.css`;

    const result = analyzeInput(tree);
    expect(result.fileCountByType['tsx']).toBe(1);
    expect(result.fileCountByType['ts']).toBe(1);
    expect(result.fileCountByType['css']).toBe(1);
  });
});
