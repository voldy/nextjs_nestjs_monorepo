// Export all factories
export { UserEntityFactory } from './user-entity.factory.ts'
export type { UserEntityParams } from './user-entity.factory.ts'

export { CreateUserDtoFactory, UpdateUserDtoFactory } from './user-dto.factory.ts'

export { DatabaseUserFactory } from './database-user.factory.ts'
export type { DatabaseUserRecord } from './database-user.factory.ts'

export { TestScenariosFactory } from './test-scenarios.factory.ts'

// Convenience function to reset all factory sequences
export async function resetAllFactories(): Promise<void> {
  // Import factories locally to avoid circular dependency issues
  const { UserEntityFactory } = await import('./user-entity.factory.ts')
  const { CreateUserDtoFactory } = await import('./user-dto.factory.ts')
  const { DatabaseUserFactory } = await import('./database-user.factory.ts')

  UserEntityFactory.reset()
  CreateUserDtoFactory.reset()
  DatabaseUserFactory.reset()
}

// Re-export common types for convenience
export { UserRole } from '@generated/prisma/index.js'
