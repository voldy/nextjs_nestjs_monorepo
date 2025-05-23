import { Injectable } from '@nestjs/common'
import { Env, logger } from '@shared'

@Injectable()
export class AppService {
  getHello(): object {
    logger.log('Hello endpoint called')

    return {
      message: 'Hello from NestJS Backend! 🚀',
      environment: Env.NODE_ENV,
      port: Env.PORT,
      timestamp: new Date().toISOString(),
    }
  }

  getHealth(): object {
    logger.log('Health check endpoint called')

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: Env.NODE_ENV,
      version: process.version,
      memory: {
        used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
        total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
      },
    }
  }
}
