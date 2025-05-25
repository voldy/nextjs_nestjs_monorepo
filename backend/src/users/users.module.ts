import { Module } from '@nestjs/common'
import { UsersService } from './users.service.ts'

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
