import { Module } from '@nestjs/common'
import { AppController } from './app.controller.ts'
import { AppService } from './app.service.ts'
import { TrpcController } from './trpc/trpc.controller.ts'
import { PrismaModule } from './prisma/prisma.module.ts'
import { UsersModule } from './users/users.module.ts'

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [AppController, TrpcController],
  providers: [AppService],
})
export class AppModule {}
