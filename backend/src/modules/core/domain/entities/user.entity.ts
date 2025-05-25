import { UserRole } from '../../../../../generated/prisma/index.js'

export class UserEntity {
  constructor(
    private readonly id: string,
    private email: string,
    private name: string | null,
    private role: UserRole,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private deletedAt: Date | null = null,
  ) {}

  // Business logic methods
  public updateEmail(newEmail: string): void {
    if (!this.isValidEmail(newEmail)) {
      throw new Error('Invalid email format')
    }
    this.email = newEmail
    this.updatedAt = new Date()
  }

  public updateName(newName: string | null): void {
    if (newName !== null && newName.trim().length === 0) {
      throw new Error('Name cannot be empty string')
    }
    this.name = newName
    this.updatedAt = new Date()
  }

  public updateRole(newRole: UserRole): void {
    if (!Object.values(UserRole).includes(newRole)) {
      throw new Error('Invalid user role')
    }
    this.role = newRole
    this.updatedAt = new Date()
  }

  public softDelete(): void {
    if (this.deletedAt !== null) {
      throw new Error('User is already deleted')
    }
    this.deletedAt = new Date()
    this.updatedAt = new Date()
  }

  public restore(): void {
    if (this.deletedAt === null) {
      throw new Error('User is not deleted')
    }
    this.deletedAt = null
    this.updatedAt = new Date()
  }

  public isDeleted(): boolean {
    return this.deletedAt !== null
  }

  public isAdmin(): boolean {
    return this.role === UserRole.ADMIN
  }

  public isModerator(): boolean {
    return this.role === UserRole.MODERATOR || this.isAdmin()
  }

  // Getters
  public getId(): string {
    return this.id
  }

  public getEmail(): string {
    return this.email
  }

  public getName(): string | null {
    return this.name
  }

  public getRole(): UserRole {
    return this.role
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }

  public getDeletedAt(): Date | null {
    return this.deletedAt
  }

  // Private helper methods
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Factory method for creating new users
  public static create(email: string, name: string | null, role: UserRole = UserRole.USER): UserEntity {
    const now = new Date()
    const id = crypto.randomUUID() // In a real app, you might want to use a more sophisticated ID generation

    const user = new UserEntity(id, email, name, role, now, now, null)

    // Validate the new user
    if (!user.isValidEmail(email)) {
      throw new Error('Invalid email format')
    }

    return user
  }

  // Convert to plain object for serialization
  public toPlainObject() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    }
  }
}
