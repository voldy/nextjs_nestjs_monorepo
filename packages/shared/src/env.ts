/// <reference types="node" />

import { z } from 'zod'
import dotenv from 'dotenv'

// Load .env (if present) into process.env.
dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z
    .string()
    .transform((s) => (s ? parseInt(s, 10) : 3000))
    .default('3000'),
  DATABASE_URL: z.string().url(),
  // (Optional) API_KEY (if used) – uncomment if needed
  // API_KEY: z.string().optional(),
  // (Optional) Frontend (Next.js) env – uncomment if needed
  // NEXT_PUBLIC_API_URL: z.string().url().optional(),
})

// Validate (and transform) process.env using the zod schema.
const _env = envSchema.safeParse(globalThis.process?.env || {})

if (!_env.success) {
  globalThis.console?.error('Environment validation failed:', _env.error.format())
  throw new Error('Environment validation failed.')
}

// Export a typed object (Env) for use in both Next.js and NestJS.
export const Env = _env.data
