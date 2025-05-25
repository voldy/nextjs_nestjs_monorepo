import { Controller, Get, Inject } from '@nestjs/common'
import { AppService } from './app.service.ts'
import { PrismaService } from './prisma/prisma.service.ts'
import { appRouter } from '@shared'
import { logger } from '@shared'

@Controller()
export class AppController {
  constructor(
    @Inject(AppService) private readonly appService: AppService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello() {
    return this.appService.getHello()
  }

  // Simple health check for load balancers (no /api prefix)
  @Get('health')
  async simpleHealthCheck() {
    try {
      const memoryUsage = process.memoryUsage()

      // Test database connectivity
      let dbStatus = 'disconnected'
      let dbLatency = 0

      try {
        const start = Date.now()
        await this.prisma.$queryRaw`SELECT 1`
        dbLatency = Date.now() - start
        dbStatus = 'connected'
      } catch (dbError) {
        logger.error('Database health check failed:', dbError)
        dbStatus = 'error'
      }

      return {
        status: dbStatus === 'connected' ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        },
        database: {
          status: dbStatus,
          latency: dbLatency,
        },
      }
    } catch (error) {
      logger.error('Health check failed:', error)
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        memory: { used: 0, total: 0 },
        database: { status: 'error', latency: 0 },
        error: 'Health check failed',
      }
    }
  }

  // Keep tRPC health endpoint for development/testing only
  @Get('trpc/health.check')
  async healthCheck() {
    const caller = appRouter.createCaller({})
    const result = await caller.health.check()
    return { result: { data: result } }
  }
}
