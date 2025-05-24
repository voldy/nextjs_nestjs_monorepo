import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module.ts'
import { Env, logger } from '@shared'
import { configureSecurity } from './config/security.config.ts'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: false }))

  // Configure security middleware
  await configureSecurity(app)

  // Global prefix for all routes
  app.setGlobalPrefix('api', { exclude: ['/health'] })

  await app.listen(Env.BACKEND_PORT, '0.0.0.0')

  logger.log(`🚀 Backend server is running on ${Env.BACKEND_URL}`)
  logger.log(`⚡ Using Fastify for high performance`)
  logger.log(`🌍 Environment: ${Env.NODE_ENV}`)
  logger.log(`🔒 CORS enabled for frontend origins`)
  logger.log(`🛡️  Security headers enabled with Helmet`)
}

bootstrap().catch((error) => {
  logger.error('Failed to start application:', error)
  process.exit(1)
})
