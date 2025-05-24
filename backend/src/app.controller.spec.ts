import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller.ts'
import { AppService } from './app.service.ts'

describe('AppController', () => {
  let appController: AppController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  describe('root', () => {
    it('should return an object with message', () => {
      const result = appController.getHello()
      expect(result).toHaveProperty('message', 'Hello from NestJS Backend! 🚀')
      expect(result).toHaveProperty('environment')
      expect(result).toHaveProperty('port')
      expect(result).toHaveProperty('timestamp')
    })
  })

  describe('health', () => {
    it('should return health check information', async () => {
      const result = await appController.simpleHealthCheck()
      expect(result).toHaveProperty('status', 'ok')
      expect(result).toHaveProperty('timestamp')
      expect(result).toHaveProperty('uptime')
      expect(result).toHaveProperty('memory')
      expect(result.memory).toHaveProperty('used')
      expect(result.memory).toHaveProperty('total')
    })
  })

  describe('tRPC health', () => {
    it('should return tRPC health check result', async () => {
      const result = await appController.healthCheck()
      expect(result).toHaveProperty('result')
      expect(result.result).toHaveProperty('data')
    })
  })
})
