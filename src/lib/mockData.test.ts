import { describe, it, expect } from 'vitest';
import { buildMockAnalysis, MOCK_FILES, MOCK_DEPENDENCIES } from './mockData';

describe('mockData', () => {
  it('buildMockAnalysis returns a complete analysis result', () => {
    const analysis = buildMockAnalysis();

    expect(analysis.projectName).toBe('my-nextjs-app');
    expect(analysis.totalFiles).toBe(MOCK_FILES.length);
    expect(analysis.totalLines).toBeGreaterThan(0);
    expect(analysis.files.length).toBeGreaterThan(0);
    expect(analysis.dependencies.length).toBeGreaterThan(0);
    expect(Object.keys(analysis.fileCountByType).length).toBeGreaterThan(0);
    expect(Object.keys(analysis.directoryStructure).length).toBeGreaterThan(0);
  });

  it('MOCK_FILES all have required properties', () => {
    for (const file of MOCK_FILES) {
      expect(file.path).toBeTruthy();
      expect(file.type).toBe('file');
      expect(file.size).toBeGreaterThan(0);
      expect(file.complexity).toBeGreaterThanOrEqual(0);
      expect(file.complexity).toBeLessThanOrEqual(100);
    }
  });

  it('MOCK_DEPENDENCIES cover all expected categories', () => {
    const categories = new Set(MOCK_DEPENDENCIES.map(d => d.category));
    expect(categories.has('framework')).toBe(true);
    expect(categories.has('utility')).toBe(true);
    expect(categories.has('dev')).toBe(true);
    expect(categories.has('testing')).toBe(true);
  });

  it('fileCountByType sums to total files', () => {
    const analysis = buildMockAnalysis();
    const typeSum = Object.values(analysis.fileCountByType).reduce((a, b) => a + b, 0);
    expect(typeSum).toBe(analysis.totalFiles);
  });
});
