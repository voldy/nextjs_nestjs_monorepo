/// <reference types="node" />

import { z } from 'zod'
import dotenv from 'dotenv'
import { Env as SharedEnv } from '@shared'

// Load .env (if present) into process.env.
dotenv.config()

// Backend-specific environment variables
const backendEnvSchema = z.object({
  // Database configuration
  DATABASE_URL: z.string().url(),

  // Server configuration
  PORT: z
    .string()
    .transform((s) => (s ? parseInt(s, 10) : 3000))
    .default('3000'),

  // Backend host for API endpoints
  BACKEND_HOST: z.string().default('http://localhost'),

  // (Optional) API keys for backend services
  // API_KEY: z.string().optional(),

  // Clerk authentication
  CLERK_SECRET_KEY: z.string().optional(),

  // CORS origins (comma-separated for production)
  CORS_ORIGINS: z.string().optional(),

  // Rate limiting configuration
  RATE_LIMIT_MAX: z
    .string()
    .transform((s) => (s ? parseInt(s, 10) : undefined))
    .optional(),
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .transform((s) => (s ? parseInt(s, 10) : undefined))
    .optional(),
})

// Validate backend-specific environment variables
const _backendEnv = backendEnvSchema.safeParse(globalThis.process?.env || {})

if (!_backendEnv.success) {
  globalThis.console?.error('Backend environment validation failed:', _backendEnv.error.format())
  throw new Error('Backend environment validation failed.')
}

// Export combined environment (shared + backend-specific)
export const BackendEnv = {
  // Include shared environment variables
  ...SharedEnv,
  // Add backend-specific variables
  ..._backendEnv.data,
  // Computed properties
  get BACKEND_URL(): string {
    return `${this.BACKEND_HOST}:${this.PORT}`
  },
  get CORS_ORIGINS_ARRAY(): string[] {
    if (!this.CORS_ORIGINS) return []
    return this.CORS_ORIGINS.split(',').map((origin) => origin.trim())
  },
}
