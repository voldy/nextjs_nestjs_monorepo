module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@shared$': '<rootDir>/../packages/shared/src/index.ts',
    '^@shared/(.*)$': '<rootDir>/../packages/shared/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'ESNext',
          moduleResolution: 'Node16',
          target: 'ES2022',
          allowSyntheticDefaultImports: true,
          esModuleInterop: true,
          jsx: 'react-jsx',
        },
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(.pnpm/)?(@trpc|@tanstack|@testing-library|superjson))'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
}
