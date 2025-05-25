import { NestFastifyApplication } from '@nestjs/platform-fastify'
import fastifyCors from '@fastify/cors'
import { BackendEnv } from '../env.ts'

export async function configureSecurity(app: NestFastifyApplication) {
  // Register CORS
  await app.register(fastifyCors, {
    origin: [
      'http://localhost:4200', // Next.js frontend (development)
      'http://localhost:4201', // Next.js frontend (e2e testing)
      /^http:\/\/localhost:\d+$/, // Any localhost port for development
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  })

  // Register rate limiting
  const rateLimit = await import('@fastify/rate-limit')
  await app.register(rateLimit.default, {
    max: BackendEnv.RATE_LIMIT_MAX || (BackendEnv.NODE_ENV === 'production' ? 100 : 1000), // requests per window
    timeWindow: BackendEnv.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes in ms
    skipOnError: true, // Don't count failed requests
    keyGenerator: (request: any) => {
      // Use IP address for rate limiting
      return request.ip || 'unknown'
    },
    errorResponseBuilder: (request: any, context: any) => {
      return {
        code: 429,
        error: 'Too Many Requests',
        message: `Rate limit exceeded, retry in ${Math.round(context.ttl / 1000)} seconds`,
        retryAfter: Math.round(context.ttl / 1000),
      }
    },
  })

  // Register Helmet for security headers
  const helmet = await import('@fastify/helmet')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  await app.register(helmet.default as any, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
}
