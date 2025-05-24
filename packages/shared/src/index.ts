// Browser detection utilities
export { isBrowser } from './lib/isBrowser.ts'

// Environment configuration
export { Env } from './env.ts'

// Logging utilities
export { logger } from './lib/logger.ts'

// Utility functions
export { deepMerge } from './lib/deepMerge.ts'
export { sleep } from './lib/sleep.ts'

// tRPC API (router, types, and utilities)
export { appRouter } from './lib/trpc/index.ts'
export type { AppRouter, TrpcContext } from './lib/trpc/index.ts'
