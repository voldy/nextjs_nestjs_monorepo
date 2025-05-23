import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'

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
})
