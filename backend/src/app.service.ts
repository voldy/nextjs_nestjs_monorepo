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
}
