// @ts-check
import eslint from '@eslint/js'
import { config as tseslintConfig } from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'

/**
 * Flat config for Nx monorepo: supports TypeScript, React, Prettier, and project structure.
 */
export default tseslintConfig(
  // Base configuration with ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
      '**/pnpm-lock.yaml',
      '**/.git/**',
      // Config files that shouldn't be type-checked
      '**/jest.config.js',
      '**/jest.config.ts',
      '**/next.config.mjs',
      '**/*.config.{js,mjs,ts}',
      // Generated files that might cause parsing issues
      '**/generated/**',
      '**/.nx/**',
      // Prisma generated files
      '**/prisma/generated/**',
    ],
  },

  // Base ESLint config for all files
  eslint.configs.recommended,

  // Prettier config for all files
  eslintPluginPrettierRecommended,

  // JavaScript files - minimal configuration without TypeScript parser
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'prettier/prettier': 'warn',
    },
  },

  // TypeScript files - use TypeScript ESLint parser and rules
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: (await import('@typescript-eslint/parser')).default,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        // Simplified parser options to avoid hanging
        project: false, // Disable type-aware linting to prevent hanging
      },
    },
    plugins: {
      '@typescript-eslint': (await import('@typescript-eslint/eslint-plugin')).default,
    },
    rules: {
      // Base TypeScript rules (without type-aware rules that might cause hanging)
      '@typescript-eslint/no-explicit-any': 'off',
      // Prefer TypeScript version over base ESLint
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          args: 'none',
        },
      ],
      'prettier/prettier': 'warn',
    },
  },

  // React/JSX files (TypeScript and JavaScript)
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: (await import('eslint-plugin-react')).default,
      'react-hooks': (await import('eslint-plugin-react-hooks')).default,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },

  // Next.js specific files
  {
    files: ['frontend/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      next: (await import('@next/eslint-plugin-next')).default,
    },
  },

  // Backend specific files
  {
    files: ['backend/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Frontend E2E specific files (Playwright)
  {
    files: ['frontend-e2e/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Test files
  {
    files: [
      '**/*.test.{ts,tsx,js,jsx}',
      '**/__tests__/**/*.{ts,tsx,js,jsx}',
      '**/*.spec.{ts,tsx,js,jsx}',
      '**/test/**/*.{ts,tsx,js,jsx}',
      '**/test-utils/**/*.{ts,tsx,js,jsx}',
      '**/*{.,-}test{.,-}*.{ts,tsx,js,jsx}',
    ],
    plugins: {
      'testing-library': (await import('eslint-plugin-testing-library')).default,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
        // Explicitly define Jest globals to ensure they're recognized
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        afterAll: 'readonly',
        afterEach: 'readonly',
        jest: 'readonly',
        fetch: 'readonly',
      },
    },
  },
)
