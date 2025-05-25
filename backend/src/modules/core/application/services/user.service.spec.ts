import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { UserService } from './user.service.ts'
import { UserEntity } from '../../domain/entities/user.entity.ts'
import type { IUserRepository } from '../../domain/repositories/user.repository.interface.ts'
import { UserRole } from '../../../../../generated/prisma/index.js'
import {
  UserEntityFactory,
  CreateUserDtoFactory,
  UpdateUserDtoFactory,
  resetAllFactories,
} from '../../test-utils/factories/index.ts'
import type { CreateUserDto, UpdateUserDto } from './user.service.ts'

describe('UserService', () => {
  let service: UserService
  let mockUserRepository: jest.Mocked<IUserRepository>

  beforeEach(async () => {
    await resetAllFactories()

    // Create mock repository
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      findByRole: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'IUserRepository',
          useValue: mockUserRepository,
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const createUserDto = CreateUserDtoFactory.valid()

      const expectedUser = UserEntity.create(createUserDto.email, createUserDto.name ?? null, createUserDto.role)

      mockUserRepository.findByEmail.mockResolvedValue(null)
      mockUserRepository.save.mockResolvedValue(expectedUser)

      const result = await service.createUser(createUserDto)

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email)
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(UserEntity))
      expect(result.getEmail()).toBe(createUserDto.email)
      expect(result.getName()).toBe(createUserDto.name)
      expect(result.getRole()).toBe(createUserDto.role)
    })

    it('should create user with default role when not specified', async () => {
      const createUserDto = CreateUserDtoFactory.create({ role: undefined })

      mockUserRepository.findByEmail.mockResolvedValue(null)
      mockUserRepository.save.mockImplementation((user) => Promise.resolve(user))

      const result = await service.createUser(createUserDto)

      expect(result.getRole()).toBe(UserRole.USER)
    })

    it('should create user with null name', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: null,
      }

      mockUserRepository.findByEmail.mockResolvedValue(null)
      mockUserRepository.save.mockImplementation((user) => Promise.resolve(user))

      const result = await service.createUser(createUserDto)

      expect(result.getName()).toBeNull()
    })

    it('should throw error if user with email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        name: 'Test User',
      }

      const existingUser = UserEntityFactory.withEmail('existing@example.com')
      mockUserRepository.findByEmail.mockResolvedValue(existingUser)

      await expect(service.createUser(createUserDto)).rejects.toThrow('User with this email already exists')

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email)
      expect(mockUserRepository.save).not.toHaveBeenCalled()
    })
  })

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const userId = 'test-id'
      const expectedUser = UserEntity.create('test@example.com', 'Test User')

      mockUserRepository.findById.mockResolvedValue(expectedUser)

      const result = await service.getUserById(userId)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
      expect(result).toBe(expectedUser)
    })

    it('should throw NotFoundException when user not found', async () => {
      const userId = 'non-existent-id'

      mockUserRepository.findById.mockResolvedValue(null)

      await expect(service.getUserById(userId)).rejects.toThrow(NotFoundException)
      await expect(service.getUserById(userId)).rejects.toThrow(`User with ID ${userId} not found`)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
    })
  })

  describe('getUserByEmail', () => {
    it('should return user when found', async () => {
      const email = 'test@example.com'
      const expectedUser = UserEntity.create(email, 'Test User')

      mockUserRepository.findByEmail.mockResolvedValue(expectedUser)

      const result = await service.getUserByEmail(email)

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email)
      expect(result).toBe(expectedUser)
    })

    it('should return null when user not found', async () => {
      const email = 'nonexistent@example.com'

      mockUserRepository.findByEmail.mockResolvedValue(null)

      const result = await service.getUserByEmail(email)

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email)
      expect(result).toBeNull()
    })
  })

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [UserEntity.create('user1@example.com', 'User 1'), UserEntity.create('user2@example.com', 'User 2')]

      mockUserRepository.findAll.mockResolvedValue(users)

      const result = await service.getAllUsers()

      expect(mockUserRepository.findAll).toHaveBeenCalled()
      expect(result).toBe(users)
    })

    it('should return empty array when no users exist', async () => {
      mockUserRepository.findAll.mockResolvedValue([])

      const result = await service.getAllUsers()

      expect(result).toEqual([])
    })
  })

  describe('getUsersByRole', () => {
    it('should return users with specified role', async () => {
      const adminUsers = [
        UserEntity.create('admin1@example.com', 'Admin 1', UserRole.ADMIN),
        UserEntity.create('admin2@example.com', 'Admin 2', UserRole.ADMIN),
      ]

      mockUserRepository.findByRole.mockResolvedValue(adminUsers)

      const result = await service.getUsersByRole(UserRole.ADMIN)

      expect(mockUserRepository.findByRole).toHaveBeenCalledWith(UserRole.ADMIN)
      expect(result).toBe(adminUsers)
    })
  })

  describe('updateUser', () => {
    let existingUser: UserEntity

    beforeEach(() => {
      existingUser = UserEntity.create('test@example.com', 'Test User', UserRole.USER)
      mockUserRepository.findById.mockResolvedValue(existingUser)
    })

    it('should update user email', async () => {
      const userId = 'test-id'
      const updateDto = UpdateUserDtoFactory.emailOnly('newemail@example.com')

      mockUserRepository.save.mockImplementation((user) => Promise.resolve(user))

      const result = await service.updateUser(userId, updateDto)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
      expect(result.getEmail()).toBe(updateDto.email)
      expect(mockUserRepository.save).toHaveBeenCalledWith(existingUser)
    })

    it('should update user name', async () => {
      const userId = 'test-id'
      const updateDto: UpdateUserDto = {
        name: 'New Name',
      }

      mockUserRepository.save.mockImplementation((user) => Promise.resolve(user))

      const result = await service.updateUser(userId, updateDto)

      expect(result.getName()).toBe(updateDto.name)
    })

    it('should update user role', async () => {
      const userId = 'test-id'
      const updateDto: UpdateUserDto = {
        role: UserRole.ADMIN,
      }

      mockUserRepository.save.mockImplementation((user) => Promise.resolve(user))

      const result = await service.updateUser(userId, updateDto)

      expect(result.getRole()).toBe(updateDto.role)
    })

    it('should update multiple fields at once', async () => {
      const userId = 'test-id'
      const updateDto: UpdateUserDto = {
        email: 'newemail@example.com',
        name: 'New Name',
        role: UserRole.MODERATOR,
      }

      mockUserRepository.save.mockImplementation((user) => Promise.resolve(user))

      const result = await service.updateUser(userId, updateDto)

      expect(result.getEmail()).toBe(updateDto.email)
      expect(result.getName()).toBe(updateDto.name)
      expect(result.getRole()).toBe(updateDto.role)
    })

    it('should throw NotFoundException when user not found', async () => {
      const userId = 'non-existent-id'
      const updateDto: UpdateUserDto = { name: 'New Name' }

      mockUserRepository.findById.mockResolvedValue(null)

      await expect(service.updateUser(userId, updateDto)).rejects.toThrow(NotFoundException)

      expect(mockUserRepository.save).not.toHaveBeenCalled()
    })
  })

  describe('softDeleteUser', () => {
    it('should soft delete user', async () => {
      const userId = 'test-id'
      const user = UserEntity.create('test@example.com', 'Test User')

      mockUserRepository.findById.mockResolvedValue(user)
      mockUserRepository.save.mockImplementation((user) => Promise.resolve(user))

      const result = await service.softDeleteUser(userId)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
      expect(result.isDeleted()).toBe(true)
      expect(mockUserRepository.save).toHaveBeenCalledWith(user)
    })

    it('should throw NotFoundException when user not found', async () => {
      const userId = 'non-existent-id'

      mockUserRepository.findById.mockResolvedValue(null)

      await expect(service.softDeleteUser(userId)).rejects.toThrow(NotFoundException)

      expect(mockUserRepository.save).not.toHaveBeenCalled()
    })
  })

  describe('restoreUser', () => {
    it('should restore deleted user', async () => {
      const userId = 'test-id'
      const user = UserEntity.create('test@example.com', 'Test User')
      user.softDelete() // Delete first

      mockUserRepository.findById.mockResolvedValue(user)
      mockUserRepository.save.mockImplementation((user) => Promise.resolve(user))

      const result = await service.restoreUser(userId)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
      expect(result.isDeleted()).toBe(false)
      expect(mockUserRepository.save).toHaveBeenCalledWith(user)
    })

    it('should throw NotFoundException when user not found', async () => {
      const userId = 'non-existent-id'

      mockUserRepository.findById.mockResolvedValue(null)

      await expect(service.restoreUser(userId)).rejects.toThrow(NotFoundException)

      expect(mockUserRepository.save).not.toHaveBeenCalled()
    })
  })

  describe('hardDeleteUser', () => {
    it('should hard delete user', async () => {
      const userId = 'test-id'
      const user = UserEntity.create('test@example.com', 'Test User')

      mockUserRepository.findById.mockResolvedValue(user)
      mockUserRepository.delete.mockResolvedValue(undefined)

      await service.hardDeleteUser(userId)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
      expect(mockUserRepository.delete).toHaveBeenCalledWith(user.getId())
    })

    it('should throw NotFoundException when user not found', async () => {
      const userId = 'non-existent-id'

      mockUserRepository.findById.mockResolvedValue(null)

      await expect(service.hardDeleteUser(userId)).rejects.toThrow(NotFoundException)

      expect(mockUserRepository.delete).not.toHaveBeenCalled()
    })
  })

  describe('updateUserRole', () => {
    it('should update user role', async () => {
      const userId = 'test-id'
      const newRole = UserRole.ADMIN
      const user = UserEntity.create('test@example.com', 'Test User')

      mockUserRepository.findById.mockResolvedValue(user)
      mockUserRepository.save.mockImplementation((user) => Promise.resolve(user))

      const result = await service.updateUserRole(userId, newRole)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId)
      expect(result.getRole()).toBe(newRole)
      expect(mockUserRepository.save).toHaveBeenCalledWith(user)
    })
  })

  describe('getUserCount', () => {
    it('should return user count', async () => {
      const expectedCount = 42

      mockUserRepository.count.mockResolvedValue(expectedCount)

      const result = await service.getUserCount()

      expect(mockUserRepository.count).toHaveBeenCalled()
      expect(result).toBe(expectedCount)
    })
  })

  describe('getAdminUsers', () => {
    it('should return admin users', async () => {
      const adminUsers = [UserEntity.create('admin1@example.com', 'Admin 1', UserRole.ADMIN)]

      mockUserRepository.findByRole.mockResolvedValue(adminUsers)

      const result = await service.getAdminUsers()

      expect(mockUserRepository.findByRole).toHaveBeenCalledWith(UserRole.ADMIN)
      expect(result).toBe(adminUsers)
    })
  })

  describe('getModeratorUsers', () => {
    it('should return moderator users', async () => {
      const moderatorUsers = [UserEntity.create('mod1@example.com', 'Moderator 1', UserRole.MODERATOR)]

      mockUserRepository.findByRole.mockResolvedValue(moderatorUsers)

      const result = await service.getModeratorUsers()

      expect(mockUserRepository.findByRole).toHaveBeenCalledWith(UserRole.MODERATOR)
      expect(result).toBe(moderatorUsers)
    })
  })
})
