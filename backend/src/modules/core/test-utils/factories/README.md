# Core Module Test Factories

This directory contains test factories specific to the **Core** domain module. Each domain module should have its own `test-utils/factories/` directory to maintain proper bounded context separation.

## Architecture Decision

### Why Module-Specific Factories?

1. **Bounded Context Isolation**: Each domain module has its own entities, DTOs, and business logic
2. **Maintainability**: Factories are close to the code they're testing
3. **Scalability**: As new domains are added, their factories don't pollute a global namespace
4. **Domain Ownership**: Each team/domain owns their test utilities
5. **Reduced Coupling**: No cross-domain dependencies in test code

### Structure

```
backend/src/modules/
├── core/
│   ├── test-utils/
│   │   └── factories/
│   │       ├── user-entity.factory.ts      # UserEntity factory
│   │       ├── user-dto.factory.ts         # DTO factories
│   │       ├── database-user.factory.ts    # Database record factory
│   │       ├── test-scenarios.factory.ts   # Complex test scenarios
│   │       ├── index.ts                    # Exports all factories
│   │       └── README.md                   # This file
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── interfaces/
└── future-domain/
    ├── test-utils/
    │   └── factories/
    │       ├── future-entity.factory.ts
    │       └── index.ts
    └── ...
```

## Available Factories

### UserEntityFactory

Creates `UserEntity` domain objects for testing business logic.

```typescript
import { UserEntityFactory } from '../test-utils/factories'

// Basic usage
const user = UserEntityFactory.create()
const admin = UserEntityFactory.admin()
const users = UserEntityFactory.createList(5)

// With specific parameters
const customUser = UserEntityFactory.create({
  email: 'test@example.com',
  name: 'Test User',
  role: UserRole.MODERATOR,
})
```

### CreateUserDtoFactory & UpdateUserDtoFactory

Creates DTOs for testing application services.

```typescript
import { CreateUserDtoFactory, UpdateUserDtoFactory } from '../test-utils/factories'

const createDto = CreateUserDtoFactory.valid()
const adminDto = CreateUserDtoFactory.admin()
const updateDto = UpdateUserDtoFactory.emailOnly('new@example.com')
```

### DatabaseUserFactory

Creates database record objects for testing repository implementations.

```typescript
import { DatabaseUserFactory } from '../test-utils/factories'

const dbUser = DatabaseUserFactory.active()
const deletedUser = DatabaseUserFactory.deleted()
const adminUsers = DatabaseUserFactory.adminList(3)
```

### TestScenariosFactory

Creates complex test scenarios that combine multiple factories.

```typescript
import { TestScenariosFactory } from '../test-utils/factories'

const { dto, expectedUser } = TestScenariosFactory.newUserRegistration()
const { user, updateDto } = TestScenariosFactory.emailUpdate()
const { existingUser, newUserDto } = TestScenariosFactory.duplicateEmail()
```

## Usage Guidelines

### 1. Import from Module Index

Always import from the module's factory index:

```typescript
// ✅ Good
import { UserEntityFactory } from '../test-utils/factories'

// ❌ Bad - direct file import
import { UserEntityFactory } from '../test-utils/factories/user-entity.factory'
```

### 2. Reset Sequences in Tests

Reset factory sequences to ensure test isolation:

```typescript
import { resetAllFactories } from '../test-utils/factories'

beforeEach(async () => {
  await resetAllFactories()
})
```

### 3. Use Appropriate Factory Level

- **Entity Factories**: For domain logic tests
- **DTO Factories**: For application service tests
- **Database Factories**: For repository integration tests
- **Scenario Factories**: For complex workflows

### 4. Keep Factories Simple

Factories should create valid objects with sensible defaults. Complex setup should be in test scenarios.

## Adding New Factories

When adding new entities or DTOs to the Core module:

1. Create a new factory file following the naming convention
2. Export it from `index.ts`
3. Add reset functionality if the factory has sequences
4. Update this README with usage examples

## Cross-Module Testing

If you need to test interactions between modules:

1. **Preferred**: Use application service interfaces and mock them
2. **Alternative**: Create shared test contracts in `packages/shared/test-utils`
3. **Avoid**: Direct imports of other module's factories

## Example Test Structure

```typescript
// user.service.spec.ts
import { Test } from '@nestjs/testing'
import { UserService } from './user.service'
import { UserEntityFactory, CreateUserDtoFactory } from '../test-utils/factories'

describe('UserService', () => {
  let service: UserService

  beforeEach(async () => {
    // Setup test module
    await resetAllFactories()
  })

  it('should create user', async () => {
    const dto = CreateUserDtoFactory.valid()
    const result = await service.createUser(dto)

    expect(result.getEmail()).toBe(dto.email)
  })
})
```

## Benefits of This Approach

1. **Clear Ownership**: Each domain owns its test utilities
2. **No Global State**: Factories don't interfere across domains
3. **Easy Discovery**: Factories are co-located with domain code
4. **Type Safety**: Domain-specific types are properly handled
5. **Maintainable**: Changes to domain models only affect that domain's tests

This architecture scales well as the application grows and new domains are added.
