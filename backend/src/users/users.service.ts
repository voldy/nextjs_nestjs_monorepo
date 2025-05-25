import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.ts'
import { User, UserRole, Prisma } from '../../generated/prisma/index.js'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    })
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        deletedAt: null, // Only return non-deleted users
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    })
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
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

  async remove(id: string): Promise<User> {
    try {
      // Soft delete - set deletedAt timestamp
      return await this.prisma.user.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
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

  async hardDelete(id: string): Promise<User> {
    try {
      return await this.prisma.user.delete({
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

  async updateRole(id: string, role: UserRole): Promise<User> {
    return this.update(id, { role })
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        role,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async count(): Promise<number> {
    return this.prisma.user.count({
      where: {
        deletedAt: null,
      },
    })
  }
}
