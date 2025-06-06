import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../src/app.module.ts'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter())
    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('/ (GET)', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/',
    })
    expect(response.statusCode).toBe(200)
  })
})
