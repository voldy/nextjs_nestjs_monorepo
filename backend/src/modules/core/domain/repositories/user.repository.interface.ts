import { UserEntity } from '../entities/user.entity.ts'
import { UserRole } from '@generated/prisma/index.js'

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>
  findByEmail(email: string): Promise<UserEntity | null>
  findAll(): Promise<UserEntity[]>
  findByRole(role: UserRole): Promise<UserEntity[]>
  save(user: UserEntity): Promise<UserEntity>
  delete(id: string): Promise<void>
  count(): Promise<number>
}
