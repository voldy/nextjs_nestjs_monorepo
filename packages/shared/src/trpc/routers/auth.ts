import { router, protectedProcedure } from '../trpc.ts'

/**
 * Auth Router - tRPC procedures for authenticated user operations
 *
 * This router provides type-safe endpoints that require authentication:
 * - User profile information
 * - Protected user operations
 *
 * All procedures require a valid authentication token and will return
 * UNAUTHORIZED errors if the user is not authenticated.
 */
export const authRouter = router({
  /**
   * Get Current User Profile
   *
   * Returns the authenticated user's profile information from the JWT token.
   * This endpoint demonstrates how protected procedures work with Clerk authentication.
   *
   * @returns {Object} User profile information
   * @throws {TRPCError} UNAUTHORIZED if user is not authenticated
   * @example
   * ```typescript
   * const profile = await trpc.auth.me.query()
   * console.log(profile.id) // User ID from Clerk
   * ```
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    return {
      id: ctx.user.id,
      email: ctx.user.email,
      message: 'Successfully authenticated with Clerk!',
      timestamp: new Date().toISOString(),
    }
  }),

  /**
   * Protected Ping
   *
   * A simple ping endpoint that requires authentication.
   * Useful for testing authenticated API calls.
   *
   * @returns {Object} Pong response with user information
   * @throws {TRPCError} UNAUTHORIZED if user is not authenticated
   * @example
   * ```typescript
   * const pong = await trpc.auth.ping.query()
   * console.log(pong.message) // "🔒 Authenticated pong!"
   * ```
   */
  ping: protectedProcedure.query(async ({ ctx }) => {
    return {
      pong: true,
      message: '🔒 Authenticated pong!',
      userId: ctx.user.id,
      timestamp: new Date().toISOString(),
    }
  }),
})
