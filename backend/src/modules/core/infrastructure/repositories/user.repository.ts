import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service.ts'
import { IUserRepository } from '../../domain/repositories/user.repository.interface.ts'
import { UserEntity } from '../../domain/entities/user.entity.ts'
import { UserRole, Prisma } from '@generated/prisma/index.js'

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })

    if (!user) {
      return null
    }

    return this.toDomainEntity(user)
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    })

    if (!user) {
      return null
    }

    return this.toDomainEntity(user)
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return users.map((user) => this.toDomainEntity(user))
  }

  async findByRole(role: UserRole): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      where: {
        role,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return users.map((user) => this.toDomainEntity(user))
  }

  async save(userEntity: UserEntity): Promise<UserEntity> {
    const userData = userEntity.toPlainObject()

    try {
      const user = await this.prisma.user.upsert({
        where: { id: userData.id },
        create: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          deletedAt: userData.deletedAt,
        },
        update: {
          email: userData.email,
          name: userData.name,
          role: userData.role,
          updatedAt: userData.updatedAt,
          deletedAt: userData.deletedAt,
        },
      })

      return this.toDomainEntity(user)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('Email already exists')
        }
      }
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with ID ${id} not found`)
        }
      }
      throw error
    }
  }

  async count(): Promise<number> {
    return this.prisma.user.count({
      where: {
        deletedAt: null,
      },
    })
  }

  private toDomainEntity(user: any): UserEntity {
    return new UserEntity(user.id, user.email, user.name, user.role, user.createdAt, user.updatedAt, user.deletedAt)
  }
}
