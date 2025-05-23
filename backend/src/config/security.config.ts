import { NestFastifyApplication } from '@nestjs/platform-fastify'
import fastifyCors from '@fastify/cors'

export async function configureSecurity(app: NestFastifyApplication) {
  // Register CORS
  await app.register(fastifyCors, {
    origin: [
      'http://localhost:4200', // Next.js frontend (development)
      /^http:\/\/localhost:\d+$/, // Any localhost port for development
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
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
