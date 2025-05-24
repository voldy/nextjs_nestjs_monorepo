import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service.ts'
import { appRouter } from '@shared'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello()
  }

  // Simple health check for load balancers (no /api prefix)
  @Get('health')
  async simpleHealthCheck() {
    try {
      const memoryUsage = process.memoryUsage()
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        },
      }
    } catch {
      throw new Error('Health check failed')
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
