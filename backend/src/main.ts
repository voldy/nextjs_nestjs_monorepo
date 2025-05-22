import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
  const port = process.env.PORT ?? 3000

  await app.listen(port, '0.0.0.0')

  console.log(`🚀 Backend server is running on http://localhost:${port}`)
  console.log(`⚡ Using Fastify for high performance`)
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error)
  process.exit(1)
})
