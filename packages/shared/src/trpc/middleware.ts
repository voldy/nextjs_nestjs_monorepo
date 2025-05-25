import { TRPCError } from '@trpc/server'
import { t } from './trpc.ts'

// Simple logging middleware
export const loggingMiddleware = t.middleware(async ({ next, path, type }) => {
  const start = Date.now()

  globalThis.console?.log(`[tRPC] ${type.toUpperCase()} ${path} - Started`)

  try {
    const result = await next()
    const duration = Date.now() - start

    globalThis.console?.log(`[tRPC] ${type.toUpperCase()} ${path} - Success (${duration}ms)`)

    return result
  } catch (error) {
    const duration = Date.now() - start

    globalThis.console?.error(`[tRPC] ${type.toUpperCase()} ${path} - Error (${duration}ms)`, error)

    throw error
  }
})

// Rate limiting middleware - simple in-memory store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export const rateLimitMiddleware = (maxRequests = 60, windowMs = 60000) => {
  return t.middleware(async ({ next, path, ctx }) => {
    // Get client identifier (IP address or user ID)
    const clientId = (ctx.req as any)?.ip || (ctx.user as any)?.id || 'anonymous'
    const key = `${clientId}:${path}`

    const now = Date.now()
    const record = rateLimitStore.get(key)

    // Reset if window has passed
    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
      return next()
    }

    // Check if limit exceeded
    if (record.count >= maxRequests) {
      const resetIn = Math.ceil((record.resetTime - now) / 1000)
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: `Rate limit exceeded for ${path}. Try again in ${resetIn} seconds.`,
      })
    }

    // Increment counter
    record.count++
    return next()
  })
}

// Error handling middleware
export const errorHandlingMiddleware = t.middleware(async ({ next, path }) => {
  try {
    return await next()
  } catch (error) {
    // Log the error
    globalThis.console?.error(`[tRPC] Error in ${path}:`, error)

    // If it's already a TRPCError, just re-throw
    if (error instanceof TRPCError) {
      throw error
    }

    // Convert unknown errors to INTERNAL_SERVER_ERROR
    if (error instanceof Error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        cause: error,
      })
    }

    // Fallback for non-Error objects
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unknown error occurred',
    })
  }
})

// Procedure builders with middleware
export const publicProcedureWithMiddleware = t.procedure.use(errorHandlingMiddleware).use(loggingMiddleware)

export const rateLimitedProcedure = t.procedure
  .use(errorHandlingMiddleware)
  .use(loggingMiddleware)
  .use(rateLimitMiddleware(30, 60000)) // 30 requests per minute
