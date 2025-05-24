/* eslint-disable no-undef */
import { z } from 'zod'
import { router, publicProcedure } from '../trpc.ts'

export const healthRouter = router({
  // Health check procedure
  check: publicProcedure.query(async () => {
    const memoryUsage = process.memoryUsage()

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      },
      version: process.version,
    }
  }),

  // Echo procedure for testing
  echo: publicProcedure
    .input(
      z.object({
        message: z.string().min(1).max(1000),
      }),
    )
    .query(async ({ input }: { input: { message: string } }) => {
      return {
        echo: input.message,
        timestamp: new Date().toISOString(),
      }
    }),

  // Ping procedure - will be used for the frontend "Ping" button
  ping: publicProcedure
    .input(
      z.object({
        delay: z.number().min(0).max(5000).optional(),
      }),
    )
    .query(async ({ input }: { input: { delay?: number } }) => {
      if (input.delay) {
        await new Promise((resolve) => setTimeout(resolve, input.delay))
      }

      return {
        pong: true,
        timestamp: new Date().toISOString(),
        delay: input.delay || 0,
        message: '🏓 Pong from tRPC server!',
      }
    }),
})
