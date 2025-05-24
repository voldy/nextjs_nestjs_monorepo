/// <reference types="node" />

import { z } from 'zod'
import dotenv from 'dotenv'

// Load .env (if present) into process.env.
dotenv.config()

// Shared environment variables that both frontend and backend need
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})

// Validate (and transform) process.env using the zod schema.
const _env = envSchema.safeParse(globalThis.process?.env || {})

if (!_env.success) {
  globalThis.console?.error('Shared environment validation failed:', _env.error.format())
  throw new Error('Shared environment validation failed.')
}

// Export a typed object for truly shared environment variables
export const Env = {
  ..._env.data,
}
