// Main router and types
export { appRouter } from './router.ts'
export type { AppRouter } from './router.ts'

// Context
export type { TrpcContext } from './context.ts'

// Core tRPC utilities
export { t, router, publicProcedure, schemas, createError } from './trpc.ts'

// Middleware for server-side resilience
export {
  loggingMiddleware,
  rateLimitMiddleware,
  errorHandlingMiddleware,
  publicProcedureWithMiddleware,
  rateLimitedProcedure,
} from './middleware.ts'

// Individual routers (for selective imports if needed)
export { healthRouter } from './routers/health.ts'
