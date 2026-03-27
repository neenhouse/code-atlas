// Parser utilities for extracting data from package.json and file trees

import type { FileEntry, DependencyEntry, AnalysisResult } from './mockData';

export interface ParsedInput {
  type: 'package-json' | 'file-tree' | 'unknown';
  dependencies: DependencyEntry[];
  files: FileEntry[];
  fileCountByType: Record<string, number>;
  directoryStructure: Record<string, string[]>;
}

const CATEGORY_MAP: Record<string, DependencyEntry['category']> = {
  react: 'framework',
  'react-dom': 'framework',
  next: 'framework',
  vue: 'framework',
  angular: 'framework',
  svelte: 'framework',
  nuxt: 'framework',
  gatsby: 'framework',
  express: 'framework',
  tailwindcss: 'styling',
  'styled-components': 'styling',
  sass: 'styling',
  postcss: 'styling',
  autoprefixer: 'styling',
  jest: 'testing',
  vitest: 'testing',
  mocha: 'testing',
  '@testing-library/react': 'testing',
  '@testing-library/jest-dom': 'testing',
  cypress: 'testing',
  playwright: 'testing',
};

function estimatePackageSize(name: string): number {
  // Rough estimates in KB
  const sizeMap: Record<string, number> = {
    next: 8500, react: 2800, 'react-dom': 4200, vue: 3200,
    typescript: 12000, tailwindcss: 3500, jest: 4500, webpack: 6000,
    eslint: 3200, prettier: 1800, axios: 450, lodash: 1400,
  };
  return sizeMap[name] ?? Math.floor(100 + Math.random() * 900);
}

function estimateComplexity(filename: string, lineCount: number): number {
  const ext = filename.split('.').pop() ?? '';
  let base = Math.min(100, Math.floor(lineCount / 3));
  if (filename.includes('test')) base = Math.max(5, base * 0.5);
  if (ext === 'css' || ext === 'json') base = Math.max(5, base * 0.3);
  if (filename.includes('route') || filename.includes('api')) base = Math.min(100, base * 1.3);
  return Math.round(Math.min(100, Math.max(1, base)));
}

export function parsePackageJson(raw: string): DependencyEntry[] {
  try {
    const pkg = JSON.parse(raw);
    const deps: DependencyEntry[] = [];

    const addDeps = (obj: Record<string, string> | undefined, isDev: boolean) => {
      if (!obj) return;
      for (const [name, version] of Object.entries(obj)) {
        const category = CATEGORY_MAP[name] ?? (isDev ? 'dev' : 'utility');
        deps.push({
          name,
          version: version.replace(/[\^~]/, ''),
          category,
          estimatedSize: estimatePackageSize(name),
          isDev,
          isOutdated: Math.random() > 0.7, // mock
        });
      }
    };

    addDeps(pkg.dependencies, false);
    addDeps(pkg.devDependencies, true);
    return deps;
  } catch {
    return [];
  }
}

export function parseFileTree(raw: string): FileEntry[] {
  const lines = raw.split('\n');
  const files: FileEntry[] = [];
  const pathStack: string[] = [];

  for (const line of lines) {
    const trimmed = line.trimEnd();
    if (!trimmed) continue;

    // Count indentation (2 spaces per level)
    const indent = line.search(/\S/);
    const level = Math.floor(indent / 2);
    const name = trimmed.trim();

    // Adjust path stack to current level
    pathStack.length = level;

    if (name.endsWith('/')) {
      // Directory
      pathStack.push(name.slice(0, -1));
    } else {
      // File
      const fullPath = [...pathStack, name].join('/');
      const ext = name.includes('.') ? name.split('.').pop() : undefined;
      const size = 10 + Math.floor(Math.random() * 150);
      files.push({
        path: fullPath,
        type: 'file',
        extension: ext,
        size,
        complexity: estimateComplexity(name, size),
        lastModified: '2024-03-20',
      });
    }
  }

  return files;
}

export function analyzeInput(raw: string): AnalysisResult {
  const trimmed = raw.trim();
  let files: FileEntry[] = [];
  let dependencies: DependencyEntry[] = [];
  let projectName = 'untitled-project';

  // Try parsing as JSON (package.json)
  if (trimmed.startsWith('{')) {
    dependencies = parsePackageJson(trimmed);
    try {
      const pkg = JSON.parse(trimmed);
      projectName = pkg.name ?? projectName;
    } catch {
      // ignore
    }
  }

  // Try parsing as file tree
  if (trimmed.includes('/') || trimmed.includes('.tsx') || trimmed.includes('.ts')) {
    files = parseFileTree(trimmed);
  }

  const fileCountByType: Record<string, number> = {};
  for (const file of files) {
    const ext = file.extension ?? 'other';
    fileCountByType[ext] = (fileCountByType[ext] ?? 0) + 1;
  }

  const directoryStructure: Record<string, string[]> = {};
  for (const file of files) {
    const lastSlash = file.path.lastIndexOf('/');
    const dir = lastSlash >= 0 ? file.path.substring(0, lastSlash) : '.';
    if (!directoryStructure[dir]) {
      directoryStructure[dir] = [];
    }
    directoryStructure[dir].push(file.path.substring(lastSlash + 1));
  }

  return {
    projectName,
    totalFiles: files.length,
    totalLines: files.reduce((sum, f) => sum + f.size, 0),
    files,
    dependencies,
    fileCountByType,
    directoryStructure,
  };
}
