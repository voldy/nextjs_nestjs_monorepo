import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module.ts'
import { Env, logger } from '@shared'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

  await app.listen(Env.PORT, '0.0.0.0')

  logger.log(`🚀 Backend server is running on http://localhost:${Env.PORT}`)
  logger.log(`⚡ Using Fastify for high performance`)
  logger.log(`🌍 Environment: ${Env.NODE_ENV}`)
}

bootstrap().catch((error) => {
  logger.error('Failed to start application:', error)
  process.exit(1)
})
