import { router } from './trpc.ts'
import { healthRouter } from './routers/health.ts'
import { authRouter } from './routers/auth.ts'

// Main application router that merges all sub-routers
export const appRouter = router({
  health: healthRouter,
  auth: authRouter,
  // Add more routers here as we build them
  // users: usersRouter,
  // posts: postsRouter,
})

// Export the router type for client-side type safety
export type AppRouter = typeof appRouter
