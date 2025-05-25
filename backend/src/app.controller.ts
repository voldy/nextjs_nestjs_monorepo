import { Controller, Get, Inject } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger'
import { AppService } from './app.service.ts'
import { PrismaService } from './prisma/prisma.service.ts'
import { appRouter } from '@shared'
import { logger } from '@shared'
import { HealthCheckResponseDto, WelcomeResponseDto } from './dto/health-check.dto.ts'

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(
    @Inject(AppService) private readonly appService: AppService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Welcome message',
    description: 'Returns a simple welcome message from the API',
  })
  @ApiResponse({
    status: 200,
    description: 'Welcome message returned successfully',
    type: WelcomeResponseDto,
  })
  getHello() {
    return this.appService.getHello()
  }

  // Simple health check for load balancers (no /api prefix)
  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description:
      'Returns system health status including database connectivity, memory usage, and uptime. Used by load balancers and monitoring systems.',
  })
  @ApiResponse({
    status: 200,
    description: 'Health check completed successfully',
    type: HealthCheckResponseDto,
  })
  @ApiResponse({
    status: 503,
    description: 'Service degraded or unavailable',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        error: { type: 'string', example: 'Health check failed' },
      },
    },
  })
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
  @ApiExcludeEndpoint()
  async healthCheck() {
    const caller = appRouter.createCaller({})
    const result = await caller.health.check()
    return { result: { data: result } }
  }
}
