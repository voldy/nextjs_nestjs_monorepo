# Domain Architecture Guide

This document outlines the modular, Clean Architecture/DDD-inspired structure of the backend application and provides guidelines for maintaining and extending the domain architecture.

## Overview

The backend is organized into isolated domain modules, each following Clean Architecture principles with clear separation of concerns across four layers:

- **Domain Layer**: Core business logic, entities, value objects, and repository interfaces
- **Application Layer**: Use cases, application services, and orchestration logic
- **Infrastructure Layer**: Database implementations, external service integrations, and technical concerns
- **Interfaces Layer**: Controllers, DTOs, API endpoints, and external communication

## Current Structure

```
backend/src/
├── modules/
│   └── core/                    # Core domain module (users, health, etc.)
│       ├── application/
│       │   ├── services/        # Application services
│       │   └── use-cases/       # Use case implementations
│       ├── domain/
│       │   ├── entities/        # Domain entities
│       │   ├── value-objects/   # Domain value objects
│       │   └── repositories/    # Repository interfaces
│       ├── infrastructure/
│       │   ├── database/        # Database configuration and services
│       │   └── repositories/    # Repository implementations
│       ├── interfaces/
│       │   ├── controllers/     # REST controllers
│       │   ├── dto/            # Data Transfer Objects
│       │   └── trpc/           # tRPC endpoints
│       └── core.module.ts       # Domain module definition
├── config/                      # Global configuration
├── main.ts                      # Application entry point
└── app.module.ts               # Root application module
```

## Domain Boundaries and Rules

### 1. Domain Isolation

- **Never import domain logic directly** between modules
- Each domain module is self-contained with its own entities, services, and infrastructure
- Communication between domains must go through:
  - Application layer interfaces
  - Shared contracts in `packages/shared`
  - Domain events (when implemented)

### 2. Layer Dependencies

- **Domain Layer**: No dependencies on other layers (pure business logic)
- **Application Layer**: Can depend on Domain layer only
- **Infrastructure Layer**: Can depend on Domain and Application layers
- **Interfaces Layer**: Can depend on all other layers

### 3. Shared Logic Guidelines

Use `packages/shared` for:

- **Base entities and value objects** used across multiple domains
- **Domain events and event contracts**
- **Cross-domain interfaces and types**
- **Utility functions** that are domain-agnostic
- **Environment configuration** and validation schemas

Keep in domain modules:

- **Domain-specific entities** and business rules
- **Domain-specific value objects** and validation
- **Use cases** specific to that domain
- **Repository interfaces** for that domain's data

## Creating a New Domain Module

### Step 1: Create the Directory Structure

```bash
mkdir -p backend/src/modules/{domain-name}/{application,domain,infrastructure,interfaces}
mkdir -p backend/src/modules/{domain-name}/application/{services,use-cases}
mkdir -p backend/src/modules/{domain-name}/domain/{entities,value-objects,repositories}
mkdir -p backend/src/modules/{domain-name}/infrastructure/{database,repositories}
mkdir -p backend/src/modules/{domain-name}/interfaces/{controllers,dto,trpc}
```

### Step 2: Create the Domain Module

```typescript
// backend/src/modules/{domain-name}/{domain-name}.module.ts
import { Module } from '@nestjs/common'
import { PrismaModule } from '../core/infrastructure/database/prisma.module'

// Import your domain's components
import { ExampleController } from './interfaces/controllers/example.controller'
import { ExampleService } from './application/services/example.service'
import { ExampleRepository } from './infrastructure/repositories/example.repository'

@Module({
  imports: [PrismaModule], // Import shared infrastructure
  controllers: [ExampleController],
  providers: [
    ExampleService,
    ExampleRepository,
    // Add other providers
  ],
  exports: [
    ExampleService,
    // Export services that other modules might need
  ],
})
export class ExampleDomainModule {}
```

### Step 3: Register in App Module

```typescript
// backend/src/app.module.ts
import { Module } from '@nestjs/common'
import { CoreModule } from './modules/core/core.module'
import { ExampleDomainModule } from './modules/example/example.module'

@Module({
  imports: [
    CoreModule,
    ExampleDomainModule, // Add your new domain module
  ],
  // ...
})
export class AppModule {}
```

### Step 4: Implement Domain Components

#### Domain Entity Example

```typescript
// backend/src/modules/{domain-name}/domain/entities/example.entity.ts
export class ExampleEntity {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly createdAt: Date,
  ) {}

  // Domain methods and business logic
  public updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Name cannot be empty')
    }
    // Update logic
  }

  // Getters
  public getId(): string {
    return this.id
  }

  public getName(): string {
    return this.name
  }
}
```

#### Repository Interface Example

```typescript
// backend/src/modules/{domain-name}/domain/repositories/example.repository.interface.ts
import { ExampleEntity } from '../entities/example.entity'

export interface IExampleRepository {
  findById(id: string): Promise<ExampleEntity | null>
  save(entity: ExampleEntity): Promise<ExampleEntity>
  delete(id: string): Promise<void>
}
```

#### Repository Implementation Example

```typescript
// backend/src/modules/{domain-name}/infrastructure/repositories/example.repository.ts
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../core/infrastructure/database/prisma.service'
import { IExampleRepository } from '../../domain/repositories/example.repository.interface'
import { ExampleEntity } from '../../domain/entities/example.entity'

@Injectable()
export class ExampleRepository implements IExampleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ExampleEntity | null> {
    const record = await this.prisma.example.findUnique({ where: { id } })
    if (!record) return null

    return new ExampleEntity(record.id, record.name, record.createdAt)
  }

  async save(entity: ExampleEntity): Promise<ExampleEntity> {
    const record = await this.prisma.example.upsert({
      where: { id: entity.getId() },
      create: {
        id: entity.getId(),
        name: entity.getName(),
      },
      update: {
        name: entity.getName(),
      },
    })

    return new ExampleEntity(record.id, record.name, record.createdAt)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.example.delete({ where: { id } })
  }
}
```

#### Application Service Example

```typescript
// backend/src/modules/{domain-name}/application/services/example.service.ts
import { Injectable } from '@nestjs/common'
import { IExampleRepository } from '../../domain/repositories/example.repository.interface'
import { ExampleEntity } from '../../domain/entities/example.entity'

@Injectable()
export class ExampleService {
  constructor(private readonly exampleRepository: IExampleRepository) {}

  async createExample(name: string): Promise<ExampleEntity> {
    const entity = new ExampleEntity(
      this.generateId(), // Use a proper ID generation strategy
      name,
      new Date(),
    )

    return await this.exampleRepository.save(entity)
  }

  async getExample(id: string): Promise<ExampleEntity | null> {
    return await this.exampleRepository.findById(id)
  }

  private generateId(): string {
    // Implement ID generation logic
    return crypto.randomUUID()
  }
}
```

#### Controller Example

```typescript
// backend/src/modules/{domain-name}/interfaces/controllers/example.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ExampleService } from '../../application/services/example.service'
import { CreateExampleDto } from '../dto/create-example.dto'

@ApiTags('Example')
@Controller('api/examples')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new example' })
  @ApiResponse({ status: 201, description: 'Example created successfully' })
  async create(@Body() createDto: CreateExampleDto) {
    const entity = await this.exampleService.createExample(createDto.name)
    return {
      id: entity.getId(),
      name: entity.getName(),
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get example by ID' })
  async findOne(@Param('id') id: string) {
    const entity = await this.exampleService.getExample(id)
    if (!entity) {
      throw new NotFoundException('Example not found')
    }

    return {
      id: entity.getId(),
      name: entity.getName(),
    }
  }
}
```

## Naming Conventions

### Modules

- Use kebab-case for directory names: `user-management`, `price-optimizer`
- Use PascalCase for module class names: `UserManagementModule`, `PriceOptimizerModule`

### Files and Classes

- **Entities**: `{name}.entity.ts` → `UserEntity`, `ProductEntity`
- **Value Objects**: `{name}.value-object.ts` → `EmailValueObject`, `PriceValueObject`
- **Repository Interfaces**: `{name}.repository.interface.ts` → `IUserRepository`
- **Repository Implementations**: `{name}.repository.ts` → `UserRepository`
- **Services**: `{name}.service.ts` → `UserService`, `PricingService`
- **Use Cases**: `{action}-{entity}.use-case.ts` → `CreateUserUseCase`
- **Controllers**: `{name}.controller.ts` → `UserController`
- **DTOs**: `{action}-{name}.dto.ts` → `CreateUserDto`, `UpdateProductDto`

### Folders

- Use kebab-case: `value-objects`, `use-cases`
- Group by type within each layer

## Inter-Domain Communication

### ❌ Wrong: Direct Domain Import

```typescript
// DON'T DO THIS
import { UserEntity } from '../user-management/domain/entities/user.entity'
```

### ✅ Correct: Application Layer Interface

```typescript
// Define interface in packages/shared or application layer
export interface IUserService {
  findUserById(id: string): Promise<UserDto | null>
}

// Use the interface
constructor(private readonly userService: IUserService) {}
```

### ✅ Correct: Shared Types

```typescript
// packages/shared/src/types/user.types.ts
export interface UserDto {
  id: string
  email: string
  name: string
}

// Use in any domain
import { UserDto } from '@shared/types/user.types'
```

## Testing Strategy

### Unit Tests

- Test domain entities and value objects in isolation
- Mock repository interfaces in application service tests
- Test business logic without infrastructure dependencies

### Integration Tests

- Test repository implementations against real database
- Test complete use case flows
- Test API endpoints end-to-end

### Test File Organization

```
backend/src/modules/{domain-name}/
├── domain/
│   └── entities/
│       ├── example.entity.ts
│       └── example.entity.spec.ts
├── application/
│   └── services/
│       ├── example.service.ts
│       └── example.service.spec.ts
└── infrastructure/
    └── repositories/
        ├── example.repository.ts
        └── example.repository.integration.spec.ts
```

## Migration Guide

When refactoring existing code into this structure:

1. **Identify Domain Boundaries**: Group related functionality
2. **Extract Domain Logic**: Move business rules to entities and value objects
3. **Create Repository Interfaces**: Abstract data access
4. **Implement Infrastructure**: Move Prisma/database code to infrastructure layer
5. **Update Controllers**: Move to interfaces layer, inject application services
6. **Update Module Registration**: Register all components in domain module

## Best Practices

1. **Keep Domains Small**: Each domain should have a single responsibility
2. **Favor Composition**: Use dependency injection and interfaces
3. **Validate at Boundaries**: Validate input at the interfaces layer
4. **Domain-First Design**: Start with domain entities and business rules
5. **Test Business Logic**: Focus testing on domain and application layers
6. **Document Decisions**: Update this guide when making architectural decisions

## Common Pitfalls

1. **Anemic Domain Models**: Avoid entities that are just data containers
2. **Leaky Abstractions**: Don't expose infrastructure details in domain layer
3. **Circular Dependencies**: Watch for circular imports between layers
4. **Over-Engineering**: Start simple and refactor as complexity grows
5. **Shared Database Models**: Don't share Prisma models across domains

## Future Considerations

- **Domain Events**: Implement event-driven communication between domains
- **CQRS**: Separate read and write models for complex domains
- **Microservices**: Each domain module can potentially become a microservice
- **API Versioning**: Plan for API evolution within each domain
- **Performance**: Consider caching strategies at the application layer
