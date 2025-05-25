import { Module } from '@nestjs/common'
import { PrismaModule } from './infrastructure/database/prisma.module.ts'
import { AppService } from './application/services/app.service.ts'
import { UserService } from './application/services/user.service.ts'
import { UserRepository } from './infrastructure/repositories/user.repository.ts'
import { AppController } from './interfaces/controllers/app.controller.ts'
import { TrpcController } from './interfaces/trpc/trpc.controller.ts'

@Module({
  imports: [PrismaModule],
  controllers: [AppController, TrpcController],
  providers: [
    AppService,
    UserService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [AppService, UserService, 'IUserRepository'],
})
export class CoreModule {}
