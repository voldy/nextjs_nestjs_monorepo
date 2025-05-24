import { BackendEnv } from './env.js'
import { logger } from '@shared'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): object {
    logger.log('Hello endpoint called')

    return {
      message: 'Hello from NestJS Backend! 🚀',
      environment: BackendEnv.NODE_ENV,
      port: BackendEnv.PORT,
      timestamp: new Date().toISOString(),
    }
  }

  getHealth(): object {
    logger.log('Health check requested')

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: BackendEnv.NODE_ENV,
      version: '1.0.0',
      database: BackendEnv.DATABASE_URL ? 'connected' : 'not configured',
      port: BackendEnv.PORT,
    }
  }
}
