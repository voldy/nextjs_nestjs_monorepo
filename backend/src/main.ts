import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module.ts'
import { HttpStatus, ValidationPipe } from '@nestjs/common'
import { BackendEnv } from './env.ts'
import { logger } from '@shared'
import { configureSecurity } from './config/security.config.ts'
import { setupSwagger } from './config/swagger.config.ts'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: false }))

  // Configure security middleware
  await configureSecurity(app)

  // Setup API documentation
  setupSwagger(app)

  // Global prefix for all routes
  app.setGlobalPrefix('api', { exclude: ['/health'] })

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: false,
    }),
  )

  const port = BackendEnv.PORT
  await app.listen(port)

  logger.log(`🚀 Backend server is running on: ${BackendEnv.BACKEND_URL}`)
  logger.log(`⚡ Using Fastify for high performance`)
  logger.log(`🌍 Environment: ${BackendEnv.NODE_ENV}`)
  logger.log(`🗄️  Database: ${BackendEnv.DATABASE_URL.split('@')[1] || 'configured'}`) // Hide credentials
  logger.log(`🔒 CORS enabled for frontend origins`)
  logger.log(`🛡️  Security headers enabled with Helmet`)
  logger.log(`📚 API Documentation: ${BackendEnv.BACKEND_URL}/api/docs`)
}

bootstrap().catch((error) => {
  logger.error('Failed to start application:', error)
  process.exit(1)
})
