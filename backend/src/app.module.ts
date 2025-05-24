import { Module } from '@nestjs/common'
import { AppController } from './app.controller.ts'
import { AppService } from './app.service.ts'
import { TrpcController } from './trpc/trpc.controller.ts'

@Module({
  imports: [],
  controllers: [AppController, TrpcController],
  providers: [AppService],
})
export class AppModule {}
