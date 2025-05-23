# Backend API (`backend`)

This is the NestJS 11 backend API server for the monorepo. It provides a robust, scalable server-side application using TypeScript, modern decorators, and dependency injection.

---

## 🚀 Tech Stack

- **Framework**: NestJS 11 with TypeScript
- **Runtime**: Node.js with modern ES2022 features
- **Compilation**: SWC for fast builds and hot reloading
- **Architecture**: Modular design with decorators and dependency injection
- **Testing**: Jest with NestJS testing utilities and Supertest
- **HTTP Framework**: Express.js (configurable)
- **Linting**: ESLint 9+ with Node.js and TypeScript rules
- **Monorepo Integration**: Nx workspace with `@nx/nest` plugin for code generation
- **Package Management**: Dependencies managed at workspace root level
- **Shared Utilities**: `@shared` package for cross-platform utilities and environment validation

---

## 🛠️ Getting Started

### From Monorepo Root

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Start development server:**

   ```bash
   # Start backend only
   pnpm dev:backend

   # Or start both frontend and backend
   pnpm dev
   ```

3. **API Available at:** [http://localhost:3000](http://localhost:3000)

### Direct Nx Commands

```bash
# Development server (watch mode)
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

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.controller.ts       # Main application controller
│   ├── app.controller.spec.ts  # Controller tests
│   ├── app.module.ts          # Root application module
│   ├── app.service.ts         # Main application service
│   └── main.ts                # Application entry point
├── test/
│   ├── app.e2e-spec.ts       # End-to-end tests
│   └── jest-e2e.json         # E2E test configuration
├── dist/                      # Compiled output (after build)
├── project.json              # Nx project configuration
├── tsconfig.json             # TypeScript configuration
├── jest.config.js            # Jest test configuration
├── nest-cli.json            # NestJS CLI configuration
└── README.md
```

---

## 🎯 API Endpoints

### Available Routes

- **GET /** - Welcome message from the API
  ```bash
  curl http://localhost:3000
  # Response: "Hello World!"
  ```

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
# Unit tests
nx test backend

# End-to-end tests
nx test:e2e backend

# Test coverage
nx test:cov backend

# Watch mode
nx test:watch backend
```

### Test Structure

- **Unit tests**: Located alongside source files (`*.spec.ts`)
- **E2E tests**: Located in `test/` directory (`*.e2e-spec.ts`)
- **Setup**: Uses Jest + NestJS testing utilities + Supertest
- **Mocking**: Automatic dependency injection mocking

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

---

## 🚀 Common Development Tasks

### Adding a New Feature Module

1. **Generate the module:**

   ```bash
   cd backend
   nest generate module features/users
   ```

2. **Add controller and service:**

   ```bash
   nest generate controller features/users
   nest generate service features/users
   ```

3. **Import in AppModule:**
   ```typescript
   @Module({
     imports: [UsersModule],
     // ...
   })
   export class AppModule {}
   ```

### Adding Database Integration

```bash
# Install TypeORM or Prisma
pnpm add @nestjs/typeorm typeorm
# or
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
- **[Monorepo Root README](../README.md)** - Full monorepo documentation

---

## 🔧 Troubleshooting

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

---
