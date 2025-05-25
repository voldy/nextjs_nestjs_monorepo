import { Controller, Get, Inject } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AppService } from '../../application/services/app.service.ts'
import { PrismaService } from '../../infrastructure/database/prisma.service.ts'
import { logger } from '@shared'

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(
    @Inject(AppService)
    private readonly appService: AppService,
    @Inject(PrismaService)
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Welcome message' })
  @ApiResponse({ status: 200, description: 'Returns welcome message with server info' })
  getHello(): object {
    return this.appService.getHello()
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Returns system health status' })
  async simpleHealthCheck(): Promise<object> {
    let databaseStatus = 'connected'
    let databaseLatency = 0

    try {
      const dbStartTime = Date.now()
      await this.prismaService.$queryRaw`SELECT 1`
      databaseLatency = Date.now() - dbStartTime
    } catch (error) {
      logger.error('[ERROR] Database health check failed:', error)
      databaseStatus = 'error'
      databaseLatency = 0
    }

    const memoryUsage = process.memoryUsage()

    return {
      status: databaseStatus === 'connected' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      },
      database: {
        status: databaseStatus,
        latency: databaseLatency,
      },
    }
  }

  @Get('api/health/trpc')
  @ApiOperation({ summary: 'tRPC health check' })
  @ApiResponse({ status: 200, description: 'Returns tRPC health check result' })
  async healthCheck(): Promise<object> {
    // This would integrate with tRPC health check
    return {
      result: {
        data: await this.simpleHealthCheck(),
      },
    }
  }
}
