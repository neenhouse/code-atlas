// Mock data representing a realistic Next.js project for demo purposes

export interface FileEntry {
  path: string;
  type: 'file' | 'directory';
  extension?: string;
  size: number; // lines of code
  complexity: number; // 0-100
  lastModified: string;
}

export interface DependencyEntry {
  name: string;
  version: string;
  category: 'framework' | 'utility' | 'dev' | 'styling' | 'testing';
  estimatedSize: number; // KB
  isDev: boolean;
  isOutdated: boolean;
}

export interface AnalysisResult {
  projectName: string;
  totalFiles: number;
  totalLines: number;
  files: FileEntry[];
  dependencies: DependencyEntry[];
  fileCountByType: Record<string, number>;
  directoryStructure: Record<string, string[]>;
}

export const MOCK_PACKAGE_JSON = `{
  "name": "my-nextjs-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@tanstack/react-query": "^5.28.0",
    "axios": "^1.6.8",
    "zod": "^3.22.4",
    "zustand": "^4.5.2",
    "tailwindcss": "^3.4.3",
    "framer-motion": "^11.0.24",
    "date-fns": "^3.6.0",
    "clsx": "^2.1.0",
    "lucide-react": "^0.363.0"
  },
  "devDependencies": {
    "@types/node": "^20.12.0",
    "@types/react": "^18.2.67",
    "@types/react-dom": "^18.2.22",
    "typescript": "^5.4.3",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.1.4",
    "prettier": "^3.2.5",
    "jest": "^29.7.0",
    "@testing-library/react": "^14.2.2",
    "@testing-library/jest-dom": "^6.4.2",
    "postcss": "^8.4.38",
    "autoprefixer": "^10.4.19"
  }
}`;

export const MOCK_FILE_TREE = `src/
  app/
    layout.tsx
    page.tsx
    globals.css
    loading.tsx
    error.tsx
    not-found.tsx
    api/
      auth/
        route.ts
      users/
        route.ts
        [id]/
          route.ts
      posts/
        route.ts
  components/
    ui/
      Button.tsx
      Input.tsx
      Card.tsx
      Modal.tsx
      Select.tsx
      Badge.tsx
      Avatar.tsx
      Tooltip.tsx
    layout/
      Header.tsx
      Footer.tsx
      Sidebar.tsx
      Navigation.tsx
    forms/
      LoginForm.tsx
      SignupForm.tsx
      PostForm.tsx
    features/
      UserProfile.tsx
      PostList.tsx
      PostCard.tsx
      CommentSection.tsx
      SearchBar.tsx
      NotificationBell.tsx
  hooks/
    useAuth.ts
    useDebounce.ts
    usePosts.ts
    useUsers.ts
    useLocalStorage.ts
    useMediaQuery.ts
  lib/
    api.ts
    auth.ts
    utils.ts
    constants.ts
    validators.ts
    db.ts
  types/
    user.ts
    post.ts
    api.ts
    common.ts
  middleware.ts
public/
  images/
    logo.svg
    hero.png
    placeholder.png
  fonts/
    inter-var.woff2
tests/
  components/
    Button.test.tsx
    LoginForm.test.tsx
    PostList.test.tsx
  hooks/
    useAuth.test.ts
    usePosts.test.ts
  lib/
    utils.test.ts
    validators.test.ts`;

export const MOCK_FILES: FileEntry[] = [
  // App
  { path: 'src/app/layout.tsx', type: 'file', extension: 'tsx', size: 45, complexity: 15, lastModified: '2024-03-20' },
  { path: 'src/app/page.tsx', type: 'file', extension: 'tsx', size: 120, complexity: 35, lastModified: '2024-03-22' },
  { path: 'src/app/globals.css', type: 'file', extension: 'css', size: 180, complexity: 10, lastModified: '2024-03-15' },
  { path: 'src/app/loading.tsx', type: 'file', extension: 'tsx', size: 15, complexity: 5, lastModified: '2024-03-10' },
  { path: 'src/app/error.tsx', type: 'file', extension: 'tsx', size: 35, complexity: 20, lastModified: '2024-03-12' },
  { path: 'src/app/not-found.tsx', type: 'file', extension: 'tsx', size: 20, complexity: 5, lastModified: '2024-03-10' },
  // API Routes
  { path: 'src/app/api/auth/route.ts', type: 'file', extension: 'ts', size: 95, complexity: 55, lastModified: '2024-03-21' },
  { path: 'src/app/api/users/route.ts', type: 'file', extension: 'ts', size: 110, complexity: 60, lastModified: '2024-03-22' },
  { path: 'src/app/api/users/[id]/route.ts', type: 'file', extension: 'ts', size: 85, complexity: 50, lastModified: '2024-03-22' },
  { path: 'src/app/api/posts/route.ts', type: 'file', extension: 'ts', size: 130, complexity: 65, lastModified: '2024-03-23' },
  // UI Components
  { path: 'src/components/ui/Button.tsx', type: 'file', extension: 'tsx', size: 65, complexity: 20, lastModified: '2024-03-18' },
  { path: 'src/components/ui/Input.tsx', type: 'file', extension: 'tsx', size: 55, complexity: 18, lastModified: '2024-03-18' },
  { path: 'src/components/ui/Card.tsx', type: 'file', extension: 'tsx', size: 40, complexity: 12, lastModified: '2024-03-17' },
  { path: 'src/components/ui/Modal.tsx', type: 'file', extension: 'tsx', size: 95, complexity: 40, lastModified: '2024-03-19' },
  { path: 'src/components/ui/Select.tsx', type: 'file', extension: 'tsx', size: 80, complexity: 35, lastModified: '2024-03-18' },
  { path: 'src/components/ui/Badge.tsx', type: 'file', extension: 'tsx', size: 30, complexity: 8, lastModified: '2024-03-16' },
  { path: 'src/components/ui/Avatar.tsx', type: 'file', extension: 'tsx', size: 35, complexity: 10, lastModified: '2024-03-16' },
  { path: 'src/components/ui/Tooltip.tsx', type: 'file', extension: 'tsx', size: 70, complexity: 30, lastModified: '2024-03-19' },
  // Layout
  { path: 'src/components/layout/Header.tsx', type: 'file', extension: 'tsx', size: 85, complexity: 25, lastModified: '2024-03-20' },
  { path: 'src/components/layout/Footer.tsx', type: 'file', extension: 'tsx', size: 50, complexity: 10, lastModified: '2024-03-15' },
  { path: 'src/components/layout/Sidebar.tsx', type: 'file', extension: 'tsx', size: 110, complexity: 38, lastModified: '2024-03-21' },
  { path: 'src/components/layout/Navigation.tsx', type: 'file', extension: 'tsx', size: 75, complexity: 28, lastModified: '2024-03-20' },
  // Forms
  { path: 'src/components/forms/LoginForm.tsx', type: 'file', extension: 'tsx', size: 140, complexity: 55, lastModified: '2024-03-22' },
  { path: 'src/components/forms/SignupForm.tsx', type: 'file', extension: 'tsx', size: 180, complexity: 65, lastModified: '2024-03-22' },
  { path: 'src/components/forms/PostForm.tsx', type: 'file', extension: 'tsx', size: 160, complexity: 60, lastModified: '2024-03-23' },
  // Features
  { path: 'src/components/features/UserProfile.tsx', type: 'file', extension: 'tsx', size: 120, complexity: 42, lastModified: '2024-03-21' },
  { path: 'src/components/features/PostList.tsx', type: 'file', extension: 'tsx', size: 95, complexity: 35, lastModified: '2024-03-23' },
  { path: 'src/components/features/PostCard.tsx', type: 'file', extension: 'tsx', size: 70, complexity: 22, lastModified: '2024-03-23' },
  { path: 'src/components/features/CommentSection.tsx', type: 'file', extension: 'tsx', size: 150, complexity: 58, lastModified: '2024-03-23' },
  { path: 'src/components/features/SearchBar.tsx', type: 'file', extension: 'tsx', size: 85, complexity: 32, lastModified: '2024-03-20' },
  { path: 'src/components/features/NotificationBell.tsx', type: 'file', extension: 'tsx', size: 90, complexity: 38, lastModified: '2024-03-21' },
  // Hooks
  { path: 'src/hooks/useAuth.ts', type: 'file', extension: 'ts', size: 75, complexity: 40, lastModified: '2024-03-21' },
  { path: 'src/hooks/useDebounce.ts', type: 'file', extension: 'ts', size: 20, complexity: 10, lastModified: '2024-03-10' },
  { path: 'src/hooks/usePosts.ts', type: 'file', extension: 'ts', size: 60, complexity: 30, lastModified: '2024-03-23' },
  { path: 'src/hooks/useUsers.ts', type: 'file', extension: 'ts', size: 55, complexity: 28, lastModified: '2024-03-22' },
  { path: 'src/hooks/useLocalStorage.ts', type: 'file', extension: 'ts', size: 35, complexity: 15, lastModified: '2024-03-12' },
  { path: 'src/hooks/useMediaQuery.ts', type: 'file', extension: 'ts', size: 25, complexity: 12, lastModified: '2024-03-11' },
  // Lib
  { path: 'src/lib/api.ts', type: 'file', extension: 'ts', size: 90, complexity: 45, lastModified: '2024-03-22' },
  { path: 'src/lib/auth.ts', type: 'file', extension: 'ts', size: 120, complexity: 55, lastModified: '2024-03-21' },
  { path: 'src/lib/utils.ts', type: 'file', extension: 'ts', size: 65, complexity: 25, lastModified: '2024-03-18' },
  { path: 'src/lib/constants.ts', type: 'file', extension: 'ts', size: 30, complexity: 5, lastModified: '2024-03-10' },
  { path: 'src/lib/validators.ts', type: 'file', extension: 'ts', size: 80, complexity: 40, lastModified: '2024-03-20' },
  { path: 'src/lib/db.ts', type: 'file', extension: 'ts', size: 145, complexity: 70, lastModified: '2024-03-23' },
  // Types
  { path: 'src/types/user.ts', type: 'file', extension: 'ts', size: 35, complexity: 5, lastModified: '2024-03-15' },
  { path: 'src/types/post.ts', type: 'file', extension: 'ts', size: 40, complexity: 5, lastModified: '2024-03-15' },
  { path: 'src/types/api.ts', type: 'file', extension: 'ts', size: 25, complexity: 5, lastModified: '2024-03-15' },
  { path: 'src/types/common.ts', type: 'file', extension: 'ts', size: 20, complexity: 5, lastModified: '2024-03-14' },
  // Middleware
  { path: 'src/middleware.ts', type: 'file', extension: 'ts', size: 55, complexity: 35, lastModified: '2024-03-21' },
  // Tests
  { path: 'tests/components/Button.test.tsx', type: 'file', extension: 'tsx', size: 45, complexity: 15, lastModified: '2024-03-18' },
  { path: 'tests/components/LoginForm.test.tsx', type: 'file', extension: 'tsx', size: 80, complexity: 25, lastModified: '2024-03-22' },
  { path: 'tests/components/PostList.test.tsx', type: 'file', extension: 'tsx', size: 65, complexity: 20, lastModified: '2024-03-23' },
  { path: 'tests/hooks/useAuth.test.ts', type: 'file', extension: 'ts', size: 55, complexity: 20, lastModified: '2024-03-21' },
  { path: 'tests/hooks/usePosts.test.ts', type: 'file', extension: 'ts', size: 50, complexity: 18, lastModified: '2024-03-23' },
  { path: 'tests/lib/utils.test.ts', type: 'file', extension: 'ts', size: 40, complexity: 12, lastModified: '2024-03-18' },
  { path: 'tests/lib/validators.test.ts', type: 'file', extension: 'ts', size: 60, complexity: 22, lastModified: '2024-03-20' },
];

export const MOCK_DEPENDENCIES: DependencyEntry[] = [
  { name: 'next', version: '14.2.0', category: 'framework', estimatedSize: 8500, isDev: false, isOutdated: false },
  { name: 'react', version: '18.3.1', category: 'framework', estimatedSize: 2800, isDev: false, isOutdated: false },
  { name: 'react-dom', version: '18.3.1', category: 'framework', estimatedSize: 4200, isDev: false, isOutdated: false },
  { name: '@tanstack/react-query', version: '5.28.0', category: 'utility', estimatedSize: 1200, isDev: false, isOutdated: false },
  { name: 'axios', version: '1.6.8', category: 'utility', estimatedSize: 450, isDev: false, isOutdated: true },
  { name: 'zod', version: '3.22.4', category: 'utility', estimatedSize: 350, isDev: false, isOutdated: true },
  { name: 'zustand', version: '4.5.2', category: 'utility', estimatedSize: 80, isDev: false, isOutdated: false },
  { name: 'tailwindcss', version: '3.4.3', category: 'styling', estimatedSize: 3500, isDev: false, isOutdated: true },
  { name: 'framer-motion', version: '11.0.24', category: 'utility', estimatedSize: 2800, isDev: false, isOutdated: false },
  { name: 'date-fns', version: '3.6.0', category: 'utility', estimatedSize: 750, isDev: false, isOutdated: false },
  { name: 'clsx', version: '2.1.0', category: 'utility', estimatedSize: 12, isDev: false, isOutdated: false },
  { name: 'lucide-react', version: '0.363.0', category: 'utility', estimatedSize: 950, isDev: false, isOutdated: true },
  { name: '@types/node', version: '20.12.0', category: 'dev', estimatedSize: 180, isDev: true, isOutdated: false },
  { name: '@types/react', version: '18.2.67', category: 'dev', estimatedSize: 220, isDev: true, isOutdated: false },
  { name: '@types/react-dom', version: '18.2.22', category: 'dev', estimatedSize: 45, isDev: true, isOutdated: false },
  { name: 'typescript', version: '5.4.3', category: 'dev', estimatedSize: 12000, isDev: true, isOutdated: false },
  { name: 'eslint', version: '8.57.0', category: 'dev', estimatedSize: 3200, isDev: true, isOutdated: true },
  { name: 'eslint-config-next', version: '14.1.4', category: 'dev', estimatedSize: 150, isDev: true, isOutdated: false },
  { name: 'prettier', version: '3.2.5', category: 'dev', estimatedSize: 1800, isDev: true, isOutdated: false },
  { name: 'jest', version: '29.7.0', category: 'testing', estimatedSize: 4500, isDev: true, isOutdated: false },
  { name: '@testing-library/react', version: '14.2.2', category: 'testing', estimatedSize: 680, isDev: true, isOutdated: false },
  { name: '@testing-library/jest-dom', version: '6.4.2', category: 'testing', estimatedSize: 420, isDev: true, isOutdated: false },
  { name: 'postcss', version: '8.4.38', category: 'dev', estimatedSize: 280, isDev: true, isOutdated: false },
  { name: 'autoprefixer', version: '10.4.19', category: 'dev', estimatedSize: 320, isDev: true, isOutdated: false },
];

export function buildMockAnalysis(): AnalysisResult {
  const fileCountByType: Record<string, number> = {};
  for (const file of MOCK_FILES) {
    const ext = file.extension ?? 'other';
    fileCountByType[ext] = (fileCountByType[ext] ?? 0) + 1;
  }

  const directoryStructure: Record<string, string[]> = {};
  for (const file of MOCK_FILES) {
    const dir = file.path.substring(0, file.path.lastIndexOf('/'));
    if (!directoryStructure[dir]) {
      directoryStructure[dir] = [];
    }
    directoryStructure[dir].push(file.path.substring(file.path.lastIndexOf('/') + 1));
  }

  return {
    projectName: 'my-nextjs-app',
    totalFiles: MOCK_FILES.length,
    totalLines: MOCK_FILES.reduce((sum, f) => sum + f.size, 0),
    files: MOCK_FILES,
    dependencies: MOCK_DEPENDENCIES,
    fileCountByType,
    directoryStructure,
  };
}
