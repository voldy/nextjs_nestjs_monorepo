module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@shared$': '<rootDir>/../packages/shared/src/index.ts',
    '^@shared/(.*)$': '<rootDir>/../packages/shared/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
}
