import { UserEntity } from '../../domain/entities/user.entity.ts'
import { UserRole } from '../../../../../generated/prisma/index.js'

// User Entity Factory Parameters
export interface UserEntityParams {
  email?: string
  name?: string | null
  role?: UserRole
}

// Simple factory function that creates UserEntity instances
export class UserEntityFactory {
  private static sequence = 0

  static create(params: UserEntityParams = {}): UserEntity {
    this.sequence++

    const email = params.email || `user${this.sequence}@example.com`
    const name = params.name !== undefined ? params.name : `User ${this.sequence}`
    const role = params.role || UserRole.USER

    return UserEntity.create(email, name, role)
  }

  static createList(count: number, params: UserEntityParams = {}): UserEntity[] {
    return Array.from({ length: count }, () => this.create(params))
  }

  static reset(): void {
    this.sequence = 0
  }

  // Convenience methods for common scenarios
  static regular(): UserEntity {
    return this.create({ role: UserRole.USER })
  }

  static admin(): UserEntity {
    return this.create({ role: UserRole.ADMIN })
  }

  static moderator(): UserEntity {
    return this.create({ role: UserRole.MODERATOR })
  }

  static withName(name: string): UserEntity {
    return this.create({ name })
  }

  static withoutName(): UserEntity {
    return this.create({ name: null })
  }

  static withEmail(email: string): UserEntity {
    return this.create({ email })
  }

  static deleted(): UserEntity {
    const user = this.create()
    user.softDelete()
    return user
  }

  static adminList(count: number): UserEntity[] {
    return this.createList(count, { role: UserRole.ADMIN })
  }

  static regularList(count: number): UserEntity[] {
    return this.createList(count, { role: UserRole.USER })
  }
}
