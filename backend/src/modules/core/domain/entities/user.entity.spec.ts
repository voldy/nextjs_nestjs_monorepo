import { UserEntity } from './user.entity.ts'
import { UserRole } from '../../../../../generated/prisma/index.js'
import { resetAllFactories } from '../../test-utils/factories/index.ts'

describe('UserEntity', () => {
  beforeEach(async () => {
    await resetAllFactories()
  })

  describe('create', () => {
    it('should create a new user with valid data', () => {
      const email = 'test@example.com'
      const name = 'Test User'
      const role = UserRole.USER

      const user = UserEntity.create(email, name, role)

      expect(user.getEmail()).toBe(email)
      expect(user.getName()).toBe(name)
      expect(user.getRole()).toBe(role)
      expect(user.getId()).toBeDefined()
      expect(user.getCreatedAt()).toBeInstanceOf(Date)
      expect(user.getUpdatedAt()).toBeInstanceOf(Date)
      expect(user.getDeletedAt()).toBeNull()
      expect(user.isDeleted()).toBe(false)
    })

    it('should create a user with null name', () => {
      const user = UserEntity.create('test@example.com', null)

      expect(user.getName()).toBeNull()
      expect(user.getRole()).toBe(UserRole.USER) // default role
    })

    it('should throw error for invalid email format', () => {
      expect(() => {
        UserEntity.create('invalid-email', 'Test User')
      }).toThrow('Invalid email format')
    })

    it('should create user with default USER role when not specified', () => {
      const user = UserEntity.create('test@example.com', 'Test User')

      expect(user.getRole()).toBe(UserRole.USER)
    })
  })

  describe('updateEmail', () => {
    let user: UserEntity

    beforeEach(() => {
      user = UserEntity.create('test@example.com', 'Test User')
    })

    it('should update email with valid format', () => {
      const newEmail = 'newemail@example.com'
      const originalUpdatedAt = user.getUpdatedAt()

      // Wait a bit to ensure timestamp difference
      jest.advanceTimersByTime(1)
      user.updateEmail(newEmail)

      expect(user.getEmail()).toBe(newEmail)
      expect(user.getUpdatedAt().getTime()).toBeGreaterThan(originalUpdatedAt.getTime())
    })

    it('should throw error for invalid email format', () => {
      expect(() => {
        user.updateEmail('invalid-email')
      }).toThrow('Invalid email format')
    })

    it('should not change email if validation fails', () => {
      const originalEmail = user.getEmail()

      expect(() => {
        user.updateEmail('invalid-email')
      }).toThrow()

      expect(user.getEmail()).toBe(originalEmail)
    })
  })

  describe('updateName', () => {
    let user: UserEntity

    beforeEach(() => {
      user = UserEntity.create('test@example.com', 'Test User')
    })

    it('should update name with valid string', () => {
      const newName = 'New Name'
      user.updateName(newName)

      expect(user.getName()).toBe(newName)
    })

    it('should update name to null', () => {
      user.updateName(null)

      expect(user.getName()).toBeNull()
    })

    it('should throw error for empty string', () => {
      expect(() => {
        user.updateName('')
      }).toThrow('Name cannot be empty string')

      expect(() => {
        user.updateName('   ')
      }).toThrow('Name cannot be empty string')
    })
  })

  describe('updateRole', () => {
    let user: UserEntity

    beforeEach(() => {
      user = UserEntity.create('test@example.com', 'Test User')
    })

    it('should update role to ADMIN', () => {
      user.updateRole(UserRole.ADMIN)

      expect(user.getRole()).toBe(UserRole.ADMIN)
      expect(user.isAdmin()).toBe(true)
      expect(user.isModerator()).toBe(true) // Admin is also moderator
    })

    it('should update role to MODERATOR', () => {
      user.updateRole(UserRole.MODERATOR)

      expect(user.getRole()).toBe(UserRole.MODERATOR)
      expect(user.isAdmin()).toBe(false)
      expect(user.isModerator()).toBe(true)
    })

    it('should update role to USER', () => {
      // First make user admin
      user.updateRole(UserRole.ADMIN)

      // Then change back to user
      user.updateRole(UserRole.USER)

      expect(user.getRole()).toBe(UserRole.USER)
      expect(user.isAdmin()).toBe(false)
      expect(user.isModerator()).toBe(false)
    })
  })

  describe('soft delete operations', () => {
    let user: UserEntity

    beforeEach(() => {
      user = UserEntity.create('test@example.com', 'Test User')
    })

    it('should soft delete user', () => {
      expect(user.isDeleted()).toBe(false)

      user.softDelete()

      expect(user.isDeleted()).toBe(true)
      expect(user.getDeletedAt()).toBeInstanceOf(Date)
    })

    it('should throw error when trying to delete already deleted user', () => {
      user.softDelete()

      expect(() => {
        user.softDelete()
      }).toThrow('User is already deleted')
    })

    it('should restore deleted user', () => {
      user.softDelete()
      expect(user.isDeleted()).toBe(true)

      user.restore()

      expect(user.isDeleted()).toBe(false)
      expect(user.getDeletedAt()).toBeNull()
    })

    it('should throw error when trying to restore non-deleted user', () => {
      expect(() => {
        user.restore()
      }).toThrow('User is not deleted')
    })
  })

  describe('role checking methods', () => {
    it('should correctly identify admin user', () => {
      const admin = UserEntity.create('admin@example.com', 'Admin', UserRole.ADMIN)

      expect(admin.isAdmin()).toBe(true)
      expect(admin.isModerator()).toBe(true) // Admin is also moderator
    })

    it('should correctly identify moderator user', () => {
      const moderator = UserEntity.create('mod@example.com', 'Moderator', UserRole.MODERATOR)

      expect(moderator.isAdmin()).toBe(false)
      expect(moderator.isModerator()).toBe(true)
    })

    it('should correctly identify regular user', () => {
      const user = UserEntity.create('user@example.com', 'User', UserRole.USER)

      expect(user.isAdmin()).toBe(false)
      expect(user.isModerator()).toBe(false)
    })
  })

  describe('toPlainObject', () => {
    it('should return plain object representation', () => {
      const user = UserEntity.create('test@example.com', 'Test User', UserRole.ADMIN)
      const plainObject = user.toPlainObject()

      expect(plainObject).toEqual({
        id: user.getId(),
        email: user.getEmail(),
        name: user.getName(),
        role: user.getRole(),
        createdAt: user.getCreatedAt(),
        updatedAt: user.getUpdatedAt(),
        deletedAt: user.getDeletedAt(),
      })
    })

    it('should handle null name in plain object', () => {
      const user = UserEntity.create('test@example.com', null)
      const plainObject = user.toPlainObject()

      expect(plainObject.name).toBeNull()
    })
  })

  describe('constructor', () => {
    it('should create user with all parameters', () => {
      const id = 'test-id'
      const email = 'test@example.com'
      const name = 'Test User'
      const role = UserRole.ADMIN
      const createdAt = new Date('2024-01-01')
      const updatedAt = new Date('2024-01-02')
      const deletedAt = new Date('2024-01-03')

      const user = new UserEntity(id, email, name, role, createdAt, updatedAt, deletedAt)

      expect(user.getId()).toBe(id)
      expect(user.getEmail()).toBe(email)
      expect(user.getName()).toBe(name)
      expect(user.getRole()).toBe(role)
      expect(user.getCreatedAt()).toBe(createdAt)
      expect(user.getUpdatedAt()).toBe(updatedAt)
      expect(user.getDeletedAt()).toBe(deletedAt)
      expect(user.isDeleted()).toBe(true)
    })
  })
})

// Setup fake timers for testing timestamp updates
beforeAll(() => {
  jest.useFakeTimers()
})

afterAll(() => {
  jest.useRealTimers()
})
