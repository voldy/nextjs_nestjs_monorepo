// @ts-check
import eslint from '@eslint/js'
import { config as tseslintConfig } from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'

/**
 * Flat config for Nx monorepo: supports TypeScript, React, Prettier, and project structure.
 */
export default tseslintConfig(
  {
    // Remove ignores array block entirely
  },
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  // React support
  {
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
  // Next.js and Testing Library support
  {
    plugins: {
      next: (await import('@next/eslint-plugin-next')).default,
      'testing-library': (await import('eslint-plugin-testing-library')).default,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // Only register plugins, do not spread rules from plugin configs to avoid undefined errors
    },
  },
  // Register @typescript-eslint plugin for custom rules
  {
    plugins: {
      '@typescript-eslint': (await import('@typescript-eslint/eslint-plugin')).default,
    },
  },
  // Type-aware parser options for custom rules
  {
    languageOptions: {
      parser: (await import('@typescript-eslint/parser')).default,
      parserOptions: {
        project: ['./frontend/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        // Exclude build artifacts from type-aware linting
        exclude: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**', '**/coverage/**'],
      },
    },
  },
  // Jest globals for test files - FIXED
  {
    files: ['**/*.test.{ts,tsx,js,jsx}', '**/__tests__/**/*.{ts,tsx,js,jsx}', '**/*.spec.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  // Custom rules
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'prettier/prettier': 'warn',
    },
  },
)
