/// <reference types="node" />

import { z } from 'zod'
import { Env as SharedEnv } from '@shared'

// Frontend-specific environment variables
const frontendEnvSchema = z.object({
  // API endpoint configuration
  NEXT_PUBLIC_API_URL: z.string().url().optional(),

  // Feature flags
  NEXT_PUBLIC_FEATURE_TRPC: z
    .string()
    .transform((s) => s === 'true')
    .default('true'),

  NEXT_PUBLIC_FEATURE_ANALYTICS: z
    .string()
    .transform((s) => s === 'true')
    .default('false'),

  // External service URLs
  NEXT_PUBLIC_VERCEL_URL: z.string().optional(),

  // Development/debugging
  NEXT_PUBLIC_DEBUG: z
    .string()
    .transform((s) => s === 'true')
    .default('false'),
})

// Validate frontend-specific environment variables
const _frontendEnv = frontendEnvSchema.safeParse(globalThis.process?.env || {})

if (!_frontendEnv.success) {
  globalThis.console?.error('Frontend environment validation failed:', _frontendEnv.error.format())
  throw new Error('Frontend environment validation failed.')
}

// Export combined environment (shared + frontend-specific)
export const FrontendEnv = {
  // Include shared environment variables
  ...SharedEnv,
  // Add frontend-specific variables
  ..._frontendEnv.data,
  // Computed properties
  get API_URL(): string {
    // In development, use localhost
    if (this.NODE_ENV === 'development') {
      return 'http://localhost:3000'
    }
    // In production, use NEXT_PUBLIC_API_URL or construct from Vercel URL
    return this.NEXT_PUBLIC_API_URL || `https://${this.NEXT_PUBLIC_VERCEL_URL}` || 'http://localhost:3000'
  },
  get IS_DEVELOPMENT(): boolean {
    return this.NODE_ENV === 'development'
  },
  get IS_PRODUCTION(): boolean {
    return this.NODE_ENV === 'production'
  },
}
