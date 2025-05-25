import type { CreateUserDto, UpdateUserDto } from '../../application/services/user.service.ts'
import { UserRole } from '@generated/prisma/index.js'

// Create User DTO Factory
export class CreateUserDtoFactory {
  private static sequence = 0

  static create(params: Partial<CreateUserDto> = {}): CreateUserDto {
    this.sequence++

    return {
      email: params.email || `user${this.sequence}@example.com`,
      name: params.name !== undefined ? params.name : `User ${this.sequence}`,
      role: params.role || UserRole.USER,
    }
  }

  static createList(count: number, params: Partial<CreateUserDto> = {}): CreateUserDto[] {
    return Array.from({ length: count }, () => this.create(params))
  }

  static reset(): void {
    this.sequence = 0
  }

  // Convenience methods
  static valid(): CreateUserDto {
    return this.create()
  }

  static admin(): CreateUserDto {
    return this.create({ role: UserRole.ADMIN })
  }

  static moderator(): CreateUserDto {
    return this.create({ role: UserRole.MODERATOR })
  }

  static withoutName(): CreateUserDto {
    return this.create({ name: null })
  }

  static withEmail(email: string): CreateUserDto {
    return this.create({ email })
  }

  static withRole(role: UserRole): CreateUserDto {
    return this.create({ role })
  }
}

// Update User DTO Factory
export class UpdateUserDtoFactory {
  static create(params: UpdateUserDto = {}): UpdateUserDto {
    return {
      email: params.email,
      name: params.name,
      role: params.role,
    }
  }

  // Convenience methods for partial updates
  static emailOnly(email: string): UpdateUserDto {
    return this.create({ email })
  }

  static nameOnly(name: string): UpdateUserDto {
    return this.create({ name })
  }

  static roleOnly(role: UserRole): UpdateUserDto {
    return this.create({ role })
  }

  static full(email: string, name: string | null, role: UserRole): UpdateUserDto {
    return this.create({ email, name, role })
  }

  static clearName(): UpdateUserDto {
    return this.create({ name: null })
  }
}
