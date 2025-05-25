# Backend API (`backend`)

This is the NestJS 11 backend API server for the monorepo. It provides a robust, scalable server-side application using TypeScript, modern decorators, and dependency injection with **Prisma ORM** and **PostgreSQL**.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database server (local or remote)
- For production: Supabase account (recommended)

### Development Setup

1. **Install dependencies**

   ```bash
   # From monorepo root
   pnpm install
   ```

2. **Configure your PostgreSQL database**

   - Ensure PostgreSQL is running on your system
   - Create a development database (e.g., `monorepo_dev`)
   - Create a test database (e.g., `monorepo_test`)

3. **Configure environment variables**

   Copy `.env.example` to `.env` in the root directory and update the database URLs:

   ```bash
   # Development database
   DATABASE_URL="postgresql://username:password@localhost:5432/monorepo_dev?schema=public"

   # Test database (optional - for running tests against a separate database)
   TEST_DATABASE_URL="postgresql://username:password@localhost:5432/monorepo_test?schema=public"
   ```

4. **Setup the database**

   ```bash
   cd backend

   # Generate Prisma client
   pnpm db:generate

   # Create and run migrations
   pnpm db:migrate

   # Seed the database (optional)
   pnpm db:seed
   ```

5. **Start development server**

   ```bash
   # Start backend only
   pnpm start:dev

   # Or from monorepo root to start both frontend and backend
   cd .. && pnpm dev
   ```

6. **API Available at:** [http://localhost:3000](http://localhost:3000)

### Production Setup (Supabase)

1. **Create a Supabase project**

   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your database URL from Project Settings > Database

2. **Set production environment variables**

   ```bash
   # Production database (Supabase)
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```

3. **Deploy migrations**
   ```bash
   pnpm db:deploy
   ```

### Alternative: Direct Nx Commands

```bash
# Development server (with watch mode)
nx start:dev backend

# Production build
nx build backend

# Start production server
nx start backend

# Run tests
nx test backend

# Lint code
nx lint backend
```

---

## 📋 Available Scripts

### Database Management

- `pnpm db:generate` — Generate Prisma client
- `pnpm db:migrate` — Run database migrations (development)
- `pnpm db:push` — Push schema changes without migration
- `pnpm db:seed` — Seed the database with initial data
- `pnpm db:studio` — Open Prisma Studio (database GUI)
- `pnpm db:reset` — Reset database and run migrations
- `pnpm db:deploy` — Deploy migrations (production)

### Development

- `pnpm start:dev` — Start development server with hot reload
- `pnpm start:debug` — Start development server with debugging
- `pnpm build` — Build for production
- `pnpm start` — Start production server

### Testing

- `pnpm test` — Run unit tests
- `pnpm test:watch` — Run tests in watch mode
- `pnpm test:cov` — Run tests with coverage
- `pnpm test:e2e` — Run end-to-end tests

### Monorepo Testing

From the root directory:

- `pnpm test` — Run tests for ALL projects (backend, frontend, shared)
- `pnpm test:backend` — Run backend tests only
- `pnpm test:watch` — Run all tests in watch mode

---

## 📦 Environment Variables

| Variable            | Description                     | Example                                                                     |
| ------------------- | ------------------------------- | --------------------------------------------------------------------------- |
| `DATABASE_URL`      | PostgreSQL connection string    | `postgresql://username:password@localhost:5432/monorepo_dev?schema=public`  |
| `TEST_DATABASE_URL` | Test database connection string | `postgresql://username:password@localhost:5432/monorepo_test?schema=public` |
| `BACKEND_PORT`      | Server port                     | `3000`                                                                      |

---

## 📁 Project Structure

The backend follows a **Clean Architecture/DDD-inspired** modular structure with clear separation of concerns:

```
backend/
├── src/
│   ├── modules/
│   │   └── core/                    # Core domain module
│   │       ├── application/
│   │       │   ├── services/        # Application services (UserService)
│   │       │   └── use-cases/       # Use case implementations (business workflows)
│   │       ├── domain/
│   │       │   ├── entities/        # Domain entities (UserEntity)
│   │       │   ├── value-objects/   # Value objects (immutable domain concepts)
│   │       │   └── repositories/    # Repository interfaces
│   │       ├── infrastructure/
│   │       │   ├── database/        # Database services (PrismaService)
│   │       │   └── repositories/    # Repository implementations
│   │       ├── interfaces/
│   │       │   ├── controllers/     # REST controllers
│   │       │   ├── dto/            # Data Transfer Objects
│   │       │   └── trpc/           # tRPC endpoints
│   │       └── core.module.ts       # Domain module definition
│   ├── config/                      # Global configuration
│   ├── app.module.ts               # Root application module
│   ├── app.service.ts              # Main application service
│   ├── env.ts                      # Environment configuration
│   └── main.ts                     # Application entry point
├── docs/
│   └── domains.md                  # Domain architecture guide
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── seed.ts                     # Database seeding script
├── test/
│   ├── app.e2e-spec.ts             # End-to-end tests
│   └── jest-e2e.json               # E2E test configuration
├── dist/                           # Compiled output (after build)
├── project.json                    # Nx project configuration
├── tsconfig.json                   # TypeScript configuration
├── jest.config.js                  # Jest test configuration
├── nest-cli.json                   # NestJS CLI configuration
└── README.md
```

### Domain Architecture

The backend is organized into **domain modules** following Clean Architecture principles:

- **Domain Layer**: Pure business logic, entities, value objects, and repository interfaces
- **Application Layer**: Use cases and application services that orchestrate business workflows
- **Infrastructure Layer**: Database implementations and external integrations
- **Interfaces Layer**: Controllers, DTOs, and API endpoints

#### Layer Components

**Domain Layer:**

- **Entities**: Rich domain objects with business logic and behavior (e.g., `UserEntity`)
- **Value Objects**: Immutable objects representing domain concepts (e.g., `Email`, `Money`, `Address`)
- **Repository Interfaces**: Contracts for data access without implementation details

**Application Layer:**

- **Services**: Coordinate multiple entities and orchestrate complex business operations
- **Use Cases**: Single-purpose business workflows that implement specific user stories (e.g., `CreateUserUseCase`, `UpdateUserProfileUseCase`)

**Infrastructure Layer:**

- **Repository Implementations**: Concrete data access using Prisma, APIs, or other data sources
- **Database Services**: Database connection and configuration management

**Interfaces Layer:**

- **Controllers**: HTTP endpoints and request/response handling
- **DTOs**: Data transfer objects for API communication
- **tRPC Endpoints**: Type-safe API procedures

#### Use Cases vs Services

- **Use Cases**: Single responsibility, specific business workflows (e.g., "Register New User", "Change Password")
- **Services**: Coordinate multiple use cases or provide shared business logic across use cases

#### Value Objects

Value objects represent domain concepts that are:

- **Immutable**: Cannot be changed after creation
- **Equality by value**: Two value objects are equal if their values are equal
- **Self-validating**: Ensure they always contain valid data

Examples:

```typescript
// Email value object
class Email {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid email format')
    }
  }

  getValue(): string {
    return this.value
  }
  private isValid(email: string): boolean {
    /* validation */
  }
}

// Money value object
class Money {
  constructor(
    private readonly amount: number,
    private readonly currency: string,
  ) {
    if (amount < 0) throw new Error('Amount cannot be negative')
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies')
    }
    return new Money(this.amount + other.amount, this.currency)
  }
}
```

**Current Domains:**

- **Core**: User management, health checks, and system operations

For detailed information about the domain architecture, see [`docs/domains.md`](./docs/domains.md).

---

## 🗄️ Database Schema

The current schema includes:

### User Model

- `id` - Unique identifier (CUID)
- `email` - Unique email address
- `name` - Optional display name
- `role` - User role (USER, ADMIN, MODERATOR)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp
- `deletedAt` - Soft delete timestamp (nullable)

See `prisma/schema.prisma` for all models.

---

## 📚 API Documentation

### Interactive API Documentation (Swagger)

The backend provides comprehensive API documentation via Swagger UI:

- **Development**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **OpenAPI JSON**: [http://localhost:3000/api/docs/swagger.json](http://localhost:3000/api/docs/swagger.json)
- **OpenAPI YAML**: [http://localhost:3000/api/docs/swagger.yaml](http://localhost:3000/api/docs/swagger.yaml)

The Swagger documentation includes:

- Interactive API testing interface
- Request/response schemas with examples
- Authentication requirements
- Error response documentation
- Rate limiting information

### tRPC Integration

The backend also exposes tRPC endpoints for type-safe frontend communication:

- **Endpoint**: `/trpc/*` (development only)
- **Documentation**: See [`packages/shared/src/trpc/routers/`](../packages/shared/src/trpc/routers/)
- **Type Safety**: Full end-to-end type safety with the frontend
- **Validation**: Runtime validation with Zod schemas

**Available tRPC Procedures:**

- `health.check()` - System health information
- `health.echo(message)` - Echo test
- `health.ping(delay?)` - Connectivity test

---

## �� API Endpoints

### Health Check

The API includes a health check endpoint for monitoring and load balancer health checks:

- **GET /health** - Health check endpoint

  ```bash
  curl http://localhost:3000/health
  # Response: { "status": "ok", "timestamp": "2024-01-01T00:00:00.000Z" }
  ```

- **GET /** - Welcome message from the API
  ```bash
  curl http://localhost:3000
  # Response: "Hello World!"
  ```

The health check endpoint is excluded from the global `/api` prefix and can be used by:

- Load balancers to check if the service is healthy
- Monitoring systems (Prometheus, DataDog, etc.)
- Container orchestration platforms (Docker, Kubernetes)
- CI/CD pipelines for deployment verification

### Adding New Endpoints

#### Using Nx Generators (Recommended)

The recommended approach is to use Nx generators with the `@nx/nest` plugin from the workspace root:

```bash
# Generate a complete resource with CRUD operations
pnpm exec nx g @nx/nest:resource users --project=backend

# Generate individual components
pnpm exec nx g @nx/nest:controller users --project=backend
pnpm exec nx g @nx/nest:service users --project=backend
pnpm exec nx g @nx/nest:module users --project=backend

# Generate other NestJS components
pnpm exec nx g @nx/nest:guard auth --project=backend
pnpm exec nx g @nx/nest:interceptor logging --project=backend
pnpm exec nx g @nx/nest:pipe validation --project=backend
```

#### Using NestJS CLI (Alternative)

You can also use the NestJS CLI directly:

```bash
cd backend
nest generate controller users
nest generate service users
nest generate module users
```

---

## 🧪 Testing

### Running Tests

```bash
# From monorepo root (recommended)
pnpm test:backend     # Run backend tests only
pnpm test             # Run tests for all projects

# Direct Nx commands
nx test backend       # Unit tests
nx test:e2e backend   # End-to-end tests
nx test:cov backend   # Test coverage
nx test:watch backend # Watch mode
```

### Test Structure

- **Unit tests**: Located alongside source files (`*.spec.ts`)
- **E2E tests**: Located in `test/` directory (`*.e2e-spec.ts`)
- **Setup**: Uses Jest + NestJS testing utilities + Supertest
- **Mocking**: Automatic dependency injection mocking
- **Database Testing**: Uses PrismaTestService and helpers

### Test Database Configuration

Tests automatically use a separate test database:

- Uses `TEST_DATABASE_URL` if set in environment
- Falls back to `postgresql://localhost:5432/monorepo_test`
- Set via `src/test-setup.ts` which runs before each test suite

### Example Test

```typescript
import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'

describe('AppController', () => {
  let appController: AppController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!')
    })
  })
})
```

---

## 🏗️ Building & Deployment

### Build Commands

```bash
# Development build
nx build backend

# Production build with optimizations
nx build backend --configuration=production

# Watch mode build
nx build backend --watch
```

### Starting the Server

```bash
# Development (with watch mode)
nx start:dev backend

# Production (requires build first)
nx build backend
nx start:prod backend

# Debug mode
nx start:debug backend
```

### Environment Configuration

The server listens on the port defined by:

- `process.env.PORT` (environment variable)
- Fallback to `3000` (default)

Set environment variables in `.env.local`:

```bash
PORT=3001
NODE_ENV=development
```

---

## 🔧 Development Features

### Hot Reloading

- **SWC compilation** for fast builds
- **Watch mode** automatically restarts on file changes
- **Debug support** with Node.js inspector

### Module Architecture

NestJS uses a modular architecture:

```typescript
@Module({
  imports: [], // Other modules to import
  controllers: [], // Controllers for this module
  providers: [], // Services and other providers
  exports: [], // Providers to export to other modules
})
export class AppModule {}
```

### Dependency Injection

Clean dependency injection with decorators:

```typescript
@Injectable()
export class UsersService {
  // Service logic here
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll()
  }
}
```

---

## 📦 Key Dependencies

### Core Framework

- `@nestjs/core` - NestJS core functionality
- `@nestjs/common` - Common decorators and utilities
- `@nestjs/platform-fastify` - HTTP adapter (Express alternative)
- `reflect-metadata` - Metadata reflection for decorators
- `rxjs` - Reactive programming utilities
- `@prisma/client` & `prisma` - Prisma ORM and generated types

### Development Tools

- `@nestjs/cli` - NestJS command-line interface
- `@nestjs/testing` - Testing utilities for NestJS
- `@swc/core` - Fast TypeScript/JavaScript compiler
- `supertest` - HTTP testing library
- `ts-jest` - Jest TypeScript preset

---

## 🎛️ Configuration Files

- **`nest-cli.json`**: NestJS CLI configuration and build settings
- **`tsconfig.json`**: TypeScript configuration optimized for NestJS
- **`project.json`**: Nx project targets and build configurations
- **`jest.config.js`**: Jest testing framework configuration
- **`prisma/schema.prisma`**: Prisma schema for DB
- **`prisma/seed.ts`**: Database seeding script

---

## 🚀 Common Development Tasks

### Adding a New Domain Module

The backend follows a domain-driven architecture. To add a new domain:

1. **Create the domain structure:**

   ```bash
   mkdir -p backend/src/modules/{domain-name}/{application,domain,infrastructure,interfaces}
   mkdir -p backend/src/modules/{domain-name}/application/{services,use-cases}
   mkdir -p backend/src/modules/{domain-name}/domain/{entities,value-objects,repositories}
   mkdir -p backend/src/modules/{domain-name}/infrastructure/{database,repositories}
   mkdir -p backend/src/modules/{domain-name}/interfaces/{controllers,dto,trpc}
   ```

2. **Create the domain module:**

   ```typescript
   // backend/src/modules/{domain-name}/{domain-name}.module.ts
   import { Module } from '@nestjs/common'
   import { PrismaModule } from '../core/infrastructure/database/prisma.module'

   @Module({
     imports: [PrismaModule],
     controllers: [
       /* your controllers */
     ],
     providers: [
       /* your services and repositories */
     ],
     exports: [
       /* services to export */
     ],
   })
   export class YourDomainModule {}
   ```

3. **Register in AppModule:**

   ```typescript
   @Module({
     imports: [CoreModule, YourDomainModule],
     // ...
   })
   export class AppModule {}
   ```

4. **Follow the layer structure:**
   - **Domain**: Entities, value objects, repository interfaces
   - **Application**: Services and use cases
   - **Infrastructure**: Repository implementations, database access
   - **Interfaces**: Controllers, DTOs, API endpoints

For detailed guidelines, see [`docs/domains.md`](./docs/domains.md).

### Adding Database Integration

```bash
# Install Prisma (already included)
pnpm add prisma @prisma/client

# Generate database module
cd backend
nest generate module database
```

### Adding Authentication

```bash
# Install Passport and JWT
pnpm add @nestjs/passport @nestjs/jwt passport passport-jwt

# Generate auth module
cd backend
nest generate module auth
nest generate service auth
nest generate controller auth
```

---

## 🔗 Useful Links

- **[NestJS Documentation](https://docs.nestjs.com)** - Framework features and guides
- **[NestJS CLI](https://docs.nestjs.com/cli/overview)** - Command-line interface
- **[Fastify Documentation](https://fastify.dev/)** - HTTP framework (if using)
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - TypeScript reference
- **[Jest Documentation](https://jestjs.io/docs/getting-started)** - Testing framework
- **[SWC Documentation](https://swc.rs/)** - Fast compiler
- **[Prisma Documentation](https://www.prisma.io/docs/)** - ORM and DB tooling
- **[Supabase Documentation](https://supabase.com/docs/)** - Managed PostgreSQL (production)
- **[Monorepo Root README](../README.md)** - Full monorepo documentation

---

## 🔧 Troubleshooting

### Database Connection Issues

1. Verify PostgreSQL is running
2. Check database credentials in `.env`
3. Ensure database exists
4. Test connection: `pnpm db:studio`

### Migration Issues

1. Reset database: `pnpm db:reset`
2. Regenerate client: `pnpm db:generate`
3. Check schema syntax in `prisma/schema.prisma`

### Type Errors

1. Regenerate Prisma client: `pnpm db:generate`
2. Restart TypeScript server in your editor

### Port Already in Use

If you see `EADDRINUSE` error:

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 nx start:dev backend
```

### Build Issues

```bash
# Clear Nx cache
nx reset

# Clean build directory
rm -rf backend/dist

# Rebuild
nx build backend
```

### Module Resolution

Ensure all imports use TypeScript path mapping:

```typescript
// Use relative imports for local modules
import { AppService } from './app.service'

// Use absolute imports for external packages
import { Injectable } from '@nestjs/common'
```

---

## 💡 Best Practices

- **Use decorators** for clean, declarative code
- **Implement proper error handling** with NestJS exception filters
- **Write tests** for controllers and services
- **Use DTOs** for request/response validation
- **Implement logging** with NestJS built-in logger
- **Follow module boundaries** for maintainable architecture
- **Use environment variables** for configuration
- **Leverage dependency injection** for testable code
- **Write and run database migrations for all schema changes**
- **Use Prisma for DB access, migrations, and seeding**

---

## 📦 Shared Package Integration

The backend integrates with the monorepo's shared utilities library (`@shared`) for:

### Environment Configuration

```typescript
import { Env } from '@shared'

// Validated environment variables (using Zod)
const port = Env.PORT // Type-safe, validated
const nodeEnv = Env.NODE_ENV // 'development' | 'test' | 'production'
const databaseUrl = Env.DATABASE_URL // Validated URL format
```

### Utilities and Logging

```typescript
import { logger, deepMerge, sleep } from '@shared'

// Structured logging
logger.log('Server starting', { port: Env.PORT })
logger.warn('High memory usage detected')
logger.error('Database connection failed', error)

// Other utilities
const config = deepMerge(defaultConfig, userConfig)
await sleep(1000) // Promise-based delay
```

### Cross-Platform Compatibility

```typescript
import { isBrowser } from '@shared'

// Always returns false in Node.js backend
if (!isBrowser()) {
  // Server-side only code
  console.log('Running on server')
}
```

**Note**: The shared package provides type-safe, validated utilities that work seamlessly across the frontend and backend without requiring separate implementations.

---

## 🔒 Security Configuration

### CORS Settings

CORS (Cross-Origin Resource Sharing) is configured in `src/config/security.config.ts` and **must be updated** for production deployments.

#### Current Development Configuration

```typescript
origin: [
  'http://localhost:4200', // Next.js frontend (development)
  /^http:\/\/localhost:\d+$/, // Any localhost port for development
],
credentials: true,
methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
```

#### Production Configuration Examples

**Single Domain:**

```typescript
origin: ['https://myapp.com'],
credentials: true,
```

**Multiple Domains:**

```typescript
origin: [
  'https://myapp.com',
  'https://www.myapp.com',
  'https://admin.myapp.com',
],
credentials: true,
```

**Environment-Based:**

```typescript
origin: process.env.NODE_ENV === 'production'
  ? ['https://myapp.com']
  : [/^http:\/\/localhost:\d+$/],
credentials: true,
```

#### Security Headers (Helmet)

Content Security Policy and other security headers are also configured in `security.config.ts`. Update CSP directives based on your frontend requirements:

```typescript
contentSecurityPolicy: {
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"], // Needed for CSS-in-JS
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    // Add more directives as needed
  },
}
```

**⚠️ Important**: Always restrict CORS origins in production to prevent unauthorized access from malicious websites.
