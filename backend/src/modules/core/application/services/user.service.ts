import { Injectable, NotFoundException, Inject } from '@nestjs/common'
import { UserEntity } from '../../domain/entities/user.entity.ts'
import type { IUserRepository } from '../../domain/repositories/user.repository.interface.ts'
import { UserRole } from '@generated/prisma/index.js'

// DTOs for the service
export interface CreateUserDto {
  email: string
  name?: string | null
  role?: UserRole
}

export interface UpdateUserDto {
  email?: string
  name?: string | null
  role?: UserRole
}

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    // Check if user with email already exists
    const existingUser = await this.userRepository.findByEmail(createUserDto.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Create new user entity
    const userEntity = UserEntity.create(
      createUserDto.email,
      createUserDto.name ?? null,
      createUserDto.role ?? UserRole.USER,
    )

    // Save and return
    return await this.userRepository.save(userEntity)
  }

  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return user
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findByEmail(email)
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.findAll()
  }

  async getUsersByRole(role: UserRole): Promise<UserEntity[]> {
    return await this.userRepository.findByRole(role)
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.getUserById(id) // This will throw if not found

    // Update fields if provided
    if (updateUserDto.email !== undefined) {
      user.updateEmail(updateUserDto.email)
    }
    if (updateUserDto.name !== undefined) {
      user.updateName(updateUserDto.name)
    }
    if (updateUserDto.role !== undefined) {
      user.updateRole(updateUserDto.role)
    }

    return await this.userRepository.save(user)
  }

  async softDeleteUser(id: string): Promise<UserEntity> {
    const user = await this.getUserById(id) // This will throw if not found
    user.softDelete()
    return await this.userRepository.save(user)
  }

  async restoreUser(id: string): Promise<UserEntity> {
    const user = await this.getUserById(id) // This will throw if not found
    user.restore()
    return await this.userRepository.save(user)
  }

  async hardDeleteUser(id: string): Promise<void> {
    const user = await this.getUserById(id) // This will throw if not found
    await this.userRepository.delete(user.getId())
  }

  async updateUserRole(id: string, role: UserRole): Promise<UserEntity> {
    const user = await this.getUserById(id) // This will throw if not found
    user.updateRole(role)
    return await this.userRepository.save(user)
  }

  async getUserCount(): Promise<number> {
    return await this.userRepository.count()
  }

  async getAdminUsers(): Promise<UserEntity[]> {
    return await this.userRepository.findByRole(UserRole.ADMIN)
  }

  async getModeratorUsers(): Promise<UserEntity[]> {
    return await this.userRepository.findByRole(UserRole.MODERATOR)
  }
}
