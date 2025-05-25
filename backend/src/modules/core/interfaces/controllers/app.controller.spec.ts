import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller.ts'
import { AppService } from '../../application/services/app.service.ts'
import { PrismaService } from '../../infrastructure/database/prisma.service.ts'

describe('AppController', () => {
  let appController: AppController
  let prismaService: PrismaService

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
          },
        },
      ],
    }).compile()

    appController = app.get<AppController>(AppController)
    prismaService = app.get<PrismaService>(PrismaService)
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
    it('should return health check information with database status', async () => {
      const result = (await appController.simpleHealthCheck()) as any

      expect(result).toHaveProperty('status', 'ok')
      expect(result).toHaveProperty('timestamp')
      expect(result).toHaveProperty('uptime')
      expect(result).toHaveProperty('memory')
      expect(result.memory).toHaveProperty('used')
      expect(result.memory).toHaveProperty('total')

      // Check database status
      expect(result).toHaveProperty('database')
      expect(result.database).toHaveProperty('status', 'connected')
      expect(result.database).toHaveProperty('latency')
      expect(typeof result.database.latency).toBe('number')
      expect(result.database.latency).toBeGreaterThanOrEqual(0)
    })

    it('should return degraded status when database fails', async () => {
      // Mock database failure
      jest.spyOn(prismaService, '$queryRaw').mockRejectedValue(new Error('Database connection failed'))

      const result = (await appController.simpleHealthCheck()) as any

      expect(result).toHaveProperty('status', 'degraded')
      expect(result.database).toHaveProperty('status', 'error')
      expect(result.database).toHaveProperty('latency', 0)
    })
  })

  describe('tRPC health', () => {
    it('should return tRPC health check result', async () => {
      const result = (await appController.healthCheck()) as any
      expect(result).toHaveProperty('result')
      expect(result.result).toHaveProperty('data')
    })
  })
})
