import { Test, TestingModule } from '@nestjs/testing'
import { UserRepository } from './user.repository.ts'
import { PrismaService } from '../database/prisma.service.ts'
import { UserEntity } from '../../domain/entities/user.entity.ts'
import { UserRole } from '../../../../../generated/prisma/index.js'
import { UserEntityFactory, resetAllFactories } from '../../test-utils/factories/index.ts'

describe('UserRepository (Integration)', () => {
  let repository: UserRepository
  let prisma: PrismaService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepository, PrismaService],
    }).compile()

    repository = module.get<UserRepository>(UserRepository)
    prisma = module.get<PrismaService>(PrismaService)
  })

  beforeEach(async () => {
    await resetAllFactories()
    // Clean up database before each test
    await prisma.user.deleteMany({})
  })

  afterAll(async () => {
    // Clean up and disconnect
    await prisma.user.deleteMany({})
    await prisma.$disconnect()
  })

  describe('save', () => {
    it('should save a new user to database', async () => {
      // Use UserEntity.create() directly to test the full domain entity → repository → database flow
      const userEntity = UserEntity.create('test@example.com', 'Test User', UserRole.USER)

      const savedUser = await repository.save(userEntity)

      expect(savedUser.getId()).toBe(userEntity.getId())
      expect(savedUser.getEmail()).toBe('test@example.com')
      expect(savedUser.getName()).toBe('Test User')
      expect(savedUser.getRole()).toBe(UserRole.USER)

      // Verify it's actually in the database
      const dbUser = await prisma.user.findUnique({
        where: { id: userEntity.getId() },
      })
      expect(dbUser).toBeTruthy()
      expect(dbUser!.email).toBe('test@example.com')
    })

    it('should update existing user in database', async () => {
      // Use factory for setup since we're testing update functionality, not creation
      const userEntity = UserEntityFactory.regular()
      await repository.save(userEntity)

      // Update the user
      userEntity.updateName('Updated Name')
      userEntity.updateRole(UserRole.ADMIN)

      const updatedUser = await repository.save(userEntity)

      expect(updatedUser.getName()).toBe('Updated Name')
      expect(updatedUser.getRole()).toBe(UserRole.ADMIN)

      // Verify in database
      const dbUser = await prisma.user.findUnique({
        where: { id: userEntity.getId() },
      })
      expect(dbUser!.name).toBe('Updated Name')
      expect(dbUser!.role).toBe(UserRole.ADMIN)
    })

    it('should throw error for duplicate email', async () => {
      const user1 = UserEntity.create('duplicate@example.com', 'User 1', UserRole.USER)
      await repository.save(user1)

      const user2 = UserEntity.create('duplicate@example.com', 'User 2', UserRole.USER)

      await expect(repository.save(user2)).rejects.toThrow('Email already exists')
    })

    it('should handle soft deleted users', async () => {
      const userEntity = UserEntity.create('test@example.com', 'Test User', UserRole.USER)
      userEntity.softDelete()

      const savedUser = await repository.save(userEntity)

      expect(savedUser.isDeleted()).toBe(true)
      expect(savedUser.getDeletedAt()).toBeTruthy()

      // Verify in database
      const dbUser = await prisma.user.findUnique({
        where: { id: userEntity.getId() },
      })
      expect(dbUser!.deletedAt).toBeTruthy()
    })
  })

  describe('findById', () => {
    it('should find user by id', async () => {
      const userEntity = UserEntity.create('test@example.com', 'Test User', UserRole.USER)
      await repository.save(userEntity)

      const foundUser = await repository.findById(userEntity.getId())

      expect(foundUser).toBeTruthy()
      expect(foundUser!.getId()).toBe(userEntity.getId())
      expect(foundUser!.getEmail()).toBe('test@example.com')
    })

    it('should return null for non-existent user', async () => {
      const foundUser = await repository.findById('non-existent-id')

      expect(foundUser).toBeNull()
    })

    it('should not find soft deleted users', async () => {
      const userEntity = UserEntity.create('test@example.com', 'Test User', UserRole.USER)
      userEntity.softDelete()
      await repository.save(userEntity)

      const foundUser = await repository.findById(userEntity.getId())

      expect(foundUser).toBeNull()
    })
  })

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const userEntity = UserEntity.create('test@example.com', 'Test User', UserRole.USER)
      await repository.save(userEntity)

      const foundUser = await repository.findByEmail('test@example.com')

      expect(foundUser).toBeTruthy()
      expect(foundUser!.getEmail()).toBe('test@example.com')
      expect(foundUser!.getName()).toBe('Test User')
    })

    it('should return null for non-existent email', async () => {
      const foundUser = await repository.findByEmail('nonexistent@example.com')

      expect(foundUser).toBeNull()
    })

    it('should not find soft deleted users by email', async () => {
      const userEntity = UserEntity.create('test@example.com', 'Test User', UserRole.USER)
      userEntity.softDelete()
      await repository.save(userEntity)

      const foundUser = await repository.findByEmail('test@example.com')

      expect(foundUser).toBeNull()
    })
  })

  describe('findAll', () => {
    it('should return all non-deleted users', async () => {
      const user1 = UserEntity.create('user1@example.com', 'User 1', UserRole.USER)
      const user2 = UserEntity.create('user2@example.com', 'User 2', UserRole.ADMIN)
      const user3 = UserEntity.create('user3@example.com', 'User 3', UserRole.MODERATOR)

      await repository.save(user1)
      await repository.save(user2)
      await repository.save(user3)

      const users = await repository.findAll()

      expect(users).toHaveLength(3)
      expect(users.map((u) => u.getEmail())).toContain('user1@example.com')
      expect(users.map((u) => u.getEmail())).toContain('user2@example.com')
      expect(users.map((u) => u.getEmail())).toContain('user3@example.com')
    })

    it('should return empty array when no users exist', async () => {
      const users = await repository.findAll()

      expect(users).toEqual([])
    })

    it('should not include soft deleted users', async () => {
      const user1 = UserEntity.create('user1@example.com', 'User 1', UserRole.USER)
      const user2 = UserEntity.create('user2@example.com', 'User 2', UserRole.USER)
      user2.softDelete()

      await repository.save(user1)
      await repository.save(user2)

      const users = await repository.findAll()

      expect(users).toHaveLength(1)
      expect(users[0].getEmail()).toBe('user1@example.com')
    })

    it('should return users ordered by creation date (newest first)', async () => {
      // Create users with slight delay to ensure different timestamps
      const user1 = UserEntity.create('user1@example.com', 'User 1', UserRole.USER)
      await repository.save(user1)

      await new Promise((resolve) => setTimeout(resolve, 10))

      const user2 = UserEntity.create('user2@example.com', 'User 2', UserRole.USER)
      await repository.save(user2)

      const users = await repository.findAll()

      expect(users).toHaveLength(2)
      // Newest first
      expect(users[0].getEmail()).toBe('user2@example.com')
      expect(users[1].getEmail()).toBe('user1@example.com')
    })
  })

  describe('findByRole', () => {
    beforeEach(async () => {
      // Set up test data
      const admin1 = UserEntity.create('admin1@example.com', 'Admin 1', UserRole.ADMIN)
      const admin2 = UserEntity.create('admin2@example.com', 'Admin 2', UserRole.ADMIN)
      const mod1 = UserEntity.create('mod1@example.com', 'Mod 1', UserRole.MODERATOR)
      const user1 = UserEntity.create('user1@example.com', 'User 1', UserRole.USER)

      await repository.save(admin1)
      await repository.save(admin2)
      await repository.save(mod1)
      await repository.save(user1)
    })

    it('should find users by ADMIN role', async () => {
      const admins = await repository.findByRole(UserRole.ADMIN)

      expect(admins).toHaveLength(2)
      expect(admins.every((u) => u.getRole() === UserRole.ADMIN)).toBe(true)
      expect(admins.map((u) => u.getEmail())).toContain('admin1@example.com')
      expect(admins.map((u) => u.getEmail())).toContain('admin2@example.com')
    })

    it('should find users by MODERATOR role', async () => {
      const moderators = await repository.findByRole(UserRole.MODERATOR)

      expect(moderators).toHaveLength(1)
      expect(moderators[0].getRole()).toBe(UserRole.MODERATOR)
      expect(moderators[0].getEmail()).toBe('mod1@example.com')
    })

    it('should find users by USER role', async () => {
      const users = await repository.findByRole(UserRole.USER)

      expect(users).toHaveLength(1)
      expect(users[0].getRole()).toBe(UserRole.USER)
      expect(users[0].getEmail()).toBe('user1@example.com')
    })

    it('should return empty array for role with no users', async () => {
      // Delete all users first
      await prisma.user.deleteMany({})

      const users = await repository.findByRole(UserRole.ADMIN)

      expect(users).toEqual([])
    })
  })

  describe('delete', () => {
    it('should hard delete user from database', async () => {
      const userEntity = UserEntity.create('test@example.com', 'Test User', UserRole.USER)
      await repository.save(userEntity)

      // Verify user exists
      let dbUser = await prisma.user.findUnique({
        where: { id: userEntity.getId() },
      })
      expect(dbUser).toBeTruthy()

      await repository.delete(userEntity.getId())

      // Verify user is completely removed
      dbUser = await prisma.user.findUnique({
        where: { id: userEntity.getId() },
      })
      expect(dbUser).toBeNull()
    })

    it('should throw NotFoundException for non-existent user', async () => {
      await expect(repository.delete('non-existent-id')).rejects.toThrow('User with ID non-existent-id not found')
    })
  })

  describe('count', () => {
    it('should return count of non-deleted users', async () => {
      const user1 = UserEntity.create('user1@example.com', 'User 1', UserRole.USER)
      const user2 = UserEntity.create('user2@example.com', 'User 2', UserRole.USER)
      const user3 = UserEntity.create('user3@example.com', 'User 3', UserRole.USER)
      user3.softDelete()

      await repository.save(user1)
      await repository.save(user2)
      await repository.save(user3)

      const count = await repository.count()

      expect(count).toBe(2) // Only non-deleted users
    })

    it('should return 0 when no users exist', async () => {
      const count = await repository.count()

      expect(count).toBe(0)
    })
  })

  describe('toDomainEntity', () => {
    it('should correctly convert database record to domain entity', async () => {
      const userEntity = UserEntity.create('test@example.com', 'Test User', UserRole.ADMIN)
      await repository.save(userEntity)

      const foundUser = await repository.findById(userEntity.getId())

      expect(foundUser).toBeInstanceOf(UserEntity)
      expect(foundUser!.getId()).toBe(userEntity.getId())
      expect(foundUser!.getEmail()).toBe('test@example.com')
      expect(foundUser!.getName()).toBe('Test User')
      expect(foundUser!.getRole()).toBe(UserRole.ADMIN)
      expect(foundUser!.getCreatedAt()).toBeInstanceOf(Date)
      expect(foundUser!.getUpdatedAt()).toBeInstanceOf(Date)
      expect(foundUser!.getDeletedAt()).toBeNull()
    })

    it('should handle null name correctly', async () => {
      const userEntity = UserEntity.create('test@example.com', null, UserRole.USER)
      await repository.save(userEntity)

      const foundUser = await repository.findById(userEntity.getId())

      expect(foundUser!.getName()).toBeNull()
    })

    it('should handle deleted users correctly', async () => {
      const userEntity = UserEntity.create('test@example.com', 'Test User', UserRole.USER)
      userEntity.softDelete()
      await repository.save(userEntity)

      // Find with raw Prisma to bypass the deletedAt filter
      const dbUser = await prisma.user.findUnique({
        where: { id: userEntity.getId() },
      })

      // Manually convert to test the toDomainEntity method
      const domainUser = (repository as any).toDomainEntity(dbUser)

      expect(domainUser.isDeleted()).toBe(true)
      expect(domainUser.getDeletedAt()).toBeInstanceOf(Date)
    })
  })
})
