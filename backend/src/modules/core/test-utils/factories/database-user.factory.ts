import { UserRole } from '@generated/prisma/index.js'

// Database User Record (matches Prisma User model)
export interface DatabaseUserRecord {
  id: string
  email: string
  name: string | null
  role: UserRole
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export class DatabaseUserFactory {
  private static sequence = 0

  static create(params: Partial<DatabaseUserRecord> = {}): DatabaseUserRecord {
    this.sequence++
    const now = new Date()

    return {
      id: params.id || `user-${this.sequence}`,
      email: params.email || `user${this.sequence}@example.com`,
      name: params.name !== undefined ? params.name : `User ${this.sequence}`,
      role: params.role || UserRole.USER,
      createdAt: params.createdAt || now,
      updatedAt: params.updatedAt || now,
      deletedAt: params.deletedAt || null,
    }
  }

  static createList(count: number, params: Partial<DatabaseUserRecord> = {}): DatabaseUserRecord[] {
    return Array.from({ length: count }, () => this.create(params))
  }

  static reset(): void {
    this.sequence = 0
  }

  // Convenience methods
  static active(): DatabaseUserRecord {
    return this.create({ deletedAt: null })
  }

  static deleted(): DatabaseUserRecord {
    return this.create({ deletedAt: new Date() })
  }

  static admin(): DatabaseUserRecord {
    return this.create({ role: UserRole.ADMIN })
  }

  static moderator(): DatabaseUserRecord {
    return this.create({ role: UserRole.MODERATOR })
  }

  static withId(id: string): DatabaseUserRecord {
    return this.create({ id })
  }

  static withEmail(email: string): DatabaseUserRecord {
    return this.create({ email })
  }

  static withoutName(): DatabaseUserRecord {
    return this.create({ name: null })
  }

  static withTimestamps(createdAt: Date, updatedAt: Date): DatabaseUserRecord {
    return this.create({ createdAt, updatedAt })
  }

  static adminList(count: number): DatabaseUserRecord[] {
    return this.createList(count, { role: UserRole.ADMIN })
  }

  static activeList(count: number): DatabaseUserRecord[] {
    return this.createList(count, { deletedAt: null })
  }
}
