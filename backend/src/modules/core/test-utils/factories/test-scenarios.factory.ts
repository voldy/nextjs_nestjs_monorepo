import { UserEntityFactory } from './user-entity.factory.ts'
import { CreateUserDtoFactory, UpdateUserDtoFactory } from './user-dto.factory.ts'
import { DatabaseUserFactory } from './database-user.factory.ts'
import { UserRole } from '../../../../../generated/prisma/index.js'

// Test scenarios that combine multiple factories
export class TestScenariosFactory {
  // User creation scenarios
  static newUserRegistration() {
    return {
      dto: CreateUserDtoFactory.valid(),
      expectedUser: UserEntityFactory.regular(),
    }
  }

  static adminCreation() {
    return {
      dto: CreateUserDtoFactory.admin(),
      expectedUser: UserEntityFactory.admin(),
    }
  }

  static userWithoutName() {
    return {
      dto: CreateUserDtoFactory.withoutName(),
      expectedUser: UserEntityFactory.withoutName(),
    }
  }

  // User update scenarios
  static emailUpdate() {
    const user = UserEntityFactory.regular()
    const updateDto = UpdateUserDtoFactory.emailOnly('newemail@example.com')
    return { user, updateDto }
  }

  static nameUpdate() {
    const user = UserEntityFactory.regular()
    const updateDto = UpdateUserDtoFactory.nameOnly('New Name')
    return { user, updateDto }
  }

  static rolePromotion() {
    const user = UserEntityFactory.regular()
    const updateDto = UpdateUserDtoFactory.roleOnly(UserRole.ADMIN)
    return { user, updateDto }
  }

  static roleDemotion() {
    const user = UserEntityFactory.admin()
    const updateDto = UpdateUserDtoFactory.roleOnly(UserRole.USER)
    return { user, updateDto }
  }

  static clearUserName() {
    const user = UserEntityFactory.withName('Some Name')
    const updateDto = UpdateUserDtoFactory.clearName()
    return { user, updateDto }
  }

  // Error scenarios
  static duplicateEmail() {
    const email = 'duplicate@example.com'
    return {
      existingUser: UserEntityFactory.withEmail(email),
      newUserDto: CreateUserDtoFactory.withEmail(email),
    }
  }

  static invalidEmailUpdate() {
    const user = UserEntityFactory.regular()
    return {
      user,
      invalidEmail: 'not-an-email',
    }
  }

  // Soft delete scenarios
  static userDeletion() {
    const activeUser = UserEntityFactory.regular()
    const deletedUser = UserEntityFactory.deleted()
    return { activeUser, deletedUser }
  }

  static userRestoration() {
    const deletedUser = UserEntityFactory.deleted()
    return { deletedUser }
  }

  // Database scenarios
  static databaseUserConversion() {
    const dbUser = DatabaseUserFactory.active()
    const entityUser = UserEntityFactory.withEmail(dbUser.email)
    return { dbUser, entityUser }
  }

  static mixedUserRoles() {
    return {
      admin: UserEntityFactory.admin(),
      moderator: UserEntityFactory.moderator(),
      user: UserEntityFactory.regular(),
    }
  }

  static userHierarchy() {
    return {
      admins: UserEntityFactory.adminList(2),
      moderators: UserEntityFactory.createList(3, { role: UserRole.MODERATOR }),
      users: UserEntityFactory.regularList(5),
    }
  }

  // Repository testing scenarios
  static repositoryTestData() {
    return {
      activeUsers: DatabaseUserFactory.activeList(3),
      deletedUsers: DatabaseUserFactory.createList(2, { deletedAt: new Date() }),
      adminUsers: DatabaseUserFactory.adminList(1),
    }
  }

  // Service testing scenarios
  static serviceTestData() {
    return {
      createDtos: CreateUserDtoFactory.createList(3),
      updateDtos: [
        UpdateUserDtoFactory.emailOnly('new@example.com'),
        UpdateUserDtoFactory.nameOnly('New Name'),
        UpdateUserDtoFactory.roleOnly(UserRole.ADMIN),
      ],
      existingUsers: UserEntityFactory.createList(3),
    }
  }

  // Integration test scenarios
  static integrationTestData() {
    return {
      seedUsers: [
        DatabaseUserFactory.admin(),
        DatabaseUserFactory.moderator(),
        DatabaseUserFactory.active(),
        DatabaseUserFactory.deleted(),
      ],
      testOperations: {
        create: CreateUserDtoFactory.valid(),
        update: UpdateUserDtoFactory.full('updated@example.com', 'Updated Name', UserRole.MODERATOR),
      },
    }
  }
}
