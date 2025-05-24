import { initTRPC, TRPCError } from '@trpc/server'
import { z } from 'zod'
import superjson from 'superjson'
import type { TrpcContext } from './context.ts'

// Initialize tRPC
export const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }: { shape: any; error: any }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof z.ZodError ? error.cause.flatten() : null,
    },
  }),
})

// Base router and procedure helpers
export const router = t.router
export const publicProcedure = t.procedure

// Common input validation schemas
export const schemas = {
  id: z.string().min(1, 'ID is required'),
  pagination: z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
  }),
}

// Error helpers
export const createError = (
  code: 'BAD_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'INTERNAL_SERVER_ERROR',
  message: string,
) => {
  throw new TRPCError({ code, message })
}
