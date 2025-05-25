/* eslint-disable no-undef */
import { z } from 'zod'
import { router, publicProcedure } from '../trpc.ts'

/**
 * Health Router - tRPC procedures for system health and connectivity testing
 *
 * This router provides type-safe endpoints for:
 * - System health monitoring
 * - Connection testing (ping/pong)
 * - Echo functionality for debugging
 *
 * All procedures are public (no authentication required) and can be called
 * from the frontend using the tRPC client with full type safety.
 */
export const healthRouter = router({
  /**
   * Health Check Procedure
   *
   * Returns comprehensive system health information including:
   * - Server status and uptime
   * - Memory usage statistics
   * - Environment information
   * - Node.js version
   *
   * @returns {Object} Health status object
   * @example
   * ```typescript
   * const health = await trpc.health.check.query()
   * console.log(health.status) // 'ok'
   * ```
   */
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

  /**
   * Echo Procedure
   *
   * Simple echo functionality for testing tRPC connectivity and data flow.
   * Accepts a message string and returns it back with a timestamp.
   *
   * @param {string} input.message - Message to echo back (1-1000 characters)
   * @returns {Object} Echo response with original message and timestamp
   * @example
   * ```typescript
   * const response = await trpc.health.echo.query({ message: "Hello tRPC!" })
   * console.log(response.echo) // "Hello tRPC!"
   * ```
   */
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

  /**
   * Ping Procedure
   *
   * Connectivity test procedure that responds with "pong". Optionally accepts
   * a delay parameter to simulate network latency or test timeout handling.
   * Used by the frontend "Ping" button for real-time connectivity testing.
   *
   * @param {number} [input.delay] - Optional delay in milliseconds (0-5000ms)
   * @returns {Object} Pong response with timing information
   * @example
   * ```typescript
   * // Simple ping
   * const pong = await trpc.health.ping.query({})
   *
   * // Ping with delay
   * const slowPong = await trpc.health.ping.query({ delay: 1000 })
   * console.log(slowPong.message) // "🏓 Pong from tRPC server!"
   * ```
   */
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
