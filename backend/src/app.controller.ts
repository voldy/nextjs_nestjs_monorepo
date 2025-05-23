import { Controller, Get, Inject } from '@nestjs/common'
import { AppService } from './app.service.ts'

@Controller()
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {
    console.log('AppService injected:', appService)
    console.log('Type:', typeof appService)
  }

  @Get()
  getHello(): object {
    return this.appService.getHello()
  }

  @Get('health')
  getHealth(): object {
    return this.appService.getHealth()
  }
}
