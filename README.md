# Next.js + NestJS Monorepo

A modern full-stack monorepo powered by [Nx](https://nx.dev) and [pnpm](https://pnpm.io/), featuring a Next.js frontend, NestJS backend, and a shared utilities library with optimized development experience.

---

## 🆕 **Recent Architecture Improvements**

### ✅ **Environment Variable Management**

- **Clean Separation**: Frontend, backend, and shared environment variables properly separated
- **Type Safety**: All environment variables validated with Zod schemas
- **Smart Defaults**: Automatic API URL detection for different environments (dev/prod)
- **Deployment Ready**: Separate configurations for different deployment targets

### ✅ **Testing Architecture**

- **Factory-Based Testing**: Dynamic test data generation using Fishery factories
- **Integration Testing**: Factory consistency validation across contexts
- **Simplified Dependencies**: Removed complex HTTP mocking for faster, more reliable tests
- **Jest Globals**: Proper ESLint configuration for Jest testing environment

### ✅ **Type-Safe API Communication**

- **tRPC Integration**: End-to-end type safety between frontend and backend
- **Shared Types**: Common API types in shared package for consistency
- **Real-time Updates**: tRPC hooks with React Query for optimal UX

---

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, shadcn/ui
- **Backend**: NestJS 11, Node.js, TypeScript, Fastify, Clean Architecture/DDD structure
- **Shared Package**: TypeScript utilities library with environment validation (Zod)
- **Monorepo**: Nx 21.x for task orchestration and caching
- **Package Manager**: pnpm for fast, efficient dependency management
- **Linting**: ESLint 9+ with flat config, TypeScript-aware rules, projectService
- **Testing**: Jest with React Testing Library (frontend) and NestJS testing utilities (backend)
- **Build**: SWC for fast compilation on both frontend and backend
- **Formatting**: Prettier with automatic formatting
- **Nx Plugins**: @nx/next (frontend), @nx/nest (backend), @nx/playwright (E2E)

---

## 📁 Project Structure

```
├── frontend/             # Next.js 15 application
│   ├── src/
│   │   ├── app/         # App Router (Next.js 15)
│   │   ├── components/  # Reusable components (shadcn/ui)
│   │   └── lib/         # Utilities and helpers
│   ├── project.json     # Nx project configuration
│   └── README.md
├── backend/              # NestJS 11 API server (Clean Architecture/DDD)
│   ├── src/
│   │   ├── modules/     # Domain modules (core, etc.)
│   │   ├── config/      # Global configuration
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── docs/            # Domain architecture documentation
│   ├── test/            # End-to-end tests
│   ├── project.json     # Nx project configuration
│   └── README.md
├── packages/
│   └── shared/          # Shared utilities library
│       ├── src/
│       │   ├── index.ts # Main exports
│       │   ├── env/     # Shared environment variables (NODE_ENV only)
│       │   ├── utils/   # Cross-platform utilities
│       │   └── trpc/    # tRPC router and type definitions
│       ├── project.json # Nx project configuration
│       └── README.md
├── frontend-e2e/         # Playwright end-to-end tests
├── nx.json               # Nx workspace configuration
├── eslint.config.mjs     # ESLint flat config for all projects
├── tsconfig.base.json    # Base TypeScript configuration
└── package.json          # Root workspace configuration
```

---

## 📦 Shared Package

The monorepo includes a shared utilities library (`@shared`) that provides:

- **Environment validation** with clean separation of concerns (only NODE_ENV shared)
- **Cross-platform utilities** (browser detection, logging, deep merge, etc.)
- **tRPC setup** for end-to-end type safety between frontend and backend
- **Type-safe imports** across frontend and backend
- **Hot reloading** in development mode

### Usage Example

```typescript
// In frontend (Next.js) or backend (NestJS)
import { Env, logger, isBrowser, deepMerge, appRouter } from '@shared'

// Shared environment variables (minimal - only NODE_ENV)
console.log(`Environment: ${Env.NODE_ENV}`)

// Frontend-specific env: Use FrontendEnv from frontend/src/env.ts
// Backend-specific env: Use BackendEnv from backend/src/env.ts

// Cross-platform utilities
if (isBrowser()) {
  logger.log('Running in browser')
} else {
  logger.log('Running on server')
}

// Deep object merging
const merged = deepMerge(defaultConfig, userConfig)

// tRPC type safety (types shared, implementation separate)
// Frontend: Uses appRouter for client setup
// Backend: Exports appRouter as actual API
```

See [`packages/shared/README.md`](packages/shared/README.md) for detailed documentation.

---

## 🏗️ Backend Architecture

The backend follows a **Clean Architecture/Domain-Driven Design (DDD)** approach with modular domain organization:

### Domain Structure

```
backend/src/modules/
└── core/                    # Core domain (users, health, system)
    ├── application/         # Use cases and application services
    ├── domain/             # Business entities and repository interfaces
    ├── infrastructure/     # Database implementations and external services
    └── interfaces/         # Controllers, DTOs, and API endpoints
```

### Key Principles

- **Domain Isolation**: Each domain is self-contained with clear boundaries
- **Dependency Inversion**: Domain layer has no dependencies on infrastructure
- **Interface Segregation**: Repository interfaces defined in domain layer
- **Single Responsibility**: Each layer has a specific purpose and responsibility

### Adding New Domains

1. Create domain structure following the established pattern
2. Implement domain entities with business logic
3. Define repository interfaces in domain layer
4. Implement repositories in infrastructure layer
5. Create application services for use cases
6. Add controllers and DTOs in interfaces layer

For detailed guidelines, see [`backend/docs/domains.md`](backend/docs/domains.md).

---

## ⚙️ Configuration & Tooling

### TypeScript Configuration

- **Base config**: `tsconfig.base.json` with modern `moduleResolution: "NodeNext"`
- **Project references**: Proper TypeScript project references for fast builds
- **Path mapping**: `@shared` imports work across all projects

### ESLint Configuration

- **Flat config**: Modern ESLint 9+ configuration in `eslint.config.mjs`
- **ProjectService**: Automatic TypeScript project discovery (`projectService: true`)
- **Project references support**: Works with complex monorepo TypeScript setups
- **Consistent rules**: Same linting rules across frontend, backend, and shared package

### Jest Testing

- **Shared package support**: Jest configured to resolve `@shared` imports
- **Cross-project testing**: Tests work seamlessly across all packages
- **Fast execution**: Optimized Jest configuration for monorepo testing

### Build System

- **SWC compilation**: Fast TypeScript compilation for both development and production
- **Nx caching**: Intelligent task caching and dependency tracking
- **Hot reloading**: Shared package changes reflect immediately in dependent projects
- **Production builds**: Optimized builds with proper module resolution

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

1. **Clone and install dependencies:**

   ```bash
   pnpm install
   ```

2. **Start development servers:**

   ```bash
   # Start both frontend and backend
   pnpm dev

   # Or start individually
   pnpm dev:frontend    # Frontend on http://localhost:4200
   pnpm dev:backend     # Backend on http://localhost:3000
   ```

3. **Open your browser:**
   - Frontend: [http://localhost:4200](http://localhost:4200)
   - Backend API: [http://localhost:3000](http://localhost:3000)

---

## 📋 Available Scripts

### Monorepo Scripts

```bash
pnpm dev              # Start both apps in development mode
pnpm build            # Build all projects for production
pnpm test             # Run tests for ALL projects (backend, frontend, shared)
pnpm test:watch       # Run all tests in watch mode
pnpm lint             # Lint all projects with ESLint
```

### Individual Project Scripts

```bash
# Frontend
pnpm dev:frontend     # Start Next.js dev server
pnpm test:frontend    # Run frontend tests only
nx build frontend     # Build frontend for production
nx lint frontend      # Lint frontend code

# Backend
pnpm dev:backend      # Start NestJS dev server with watch mode
pnpm test:backend     # Run backend tests only
nx build backend      # Build backend for production
nx lint backend       # Lint backend code
nx start backend      # Start built backend in production mode

# Shared Package
pnpm test:shared      # Run shared package tests only
nx build shared       # Build shared package
nx lint shared        # Lint shared package code
```

---

## 📚 API Documentation

This monorepo provides comprehensive API documentation for both REST and tRPC endpoints:

### REST API Documentation (OpenAPI/Swagger)

- **URL**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs) (development)
- **Format**: Interactive Swagger UI with OpenAPI 3.0 specification
- **Purpose**: Documents REST endpoints for external integrations, webhooks, and third-party services
- **Features**:
  - Interactive API testing
  - Request/response schemas
  - Authentication examples
  - Error response documentation

**Available REST Endpoints:**

- `GET /health` - System health check (used by load balancers)
- `GET /api` - Welcome message
- Additional REST endpoints for external integrations

### tRPC API Documentation (Type-Safe)

- **Location**: [`packages/shared/src/trpc/routers/`](packages/shared/src/trpc/routers/)
- **Format**: TypeScript code comments with JSDoc
- **Purpose**: Type-safe communication between frontend and backend
- **Features**:
  - End-to-end type safety
  - Auto-completion in IDEs
  - Runtime type validation with Zod
  - Real-time updates with React Query integration

**Available tRPC Procedures:**

- `health.check()` - Comprehensive system health information
- `health.echo(message)` - Echo test for connectivity
- `health.ping(delay?)` - Ping/pong with optional delay

**Example tRPC Usage:**

```typescript
// Frontend usage with full type safety
import { trpc } from '@/lib/trpc'

// Health check
const health = await trpc.health.check.query()
console.log(health.status) // TypeScript knows this is 'ok' | 'degraded' | 'error'

// Ping test
const pong = await trpc.health.ping.query({ delay: 1000 })
console.log(pong.message) // "🏓 Pong from tRPC server!"
```

### Documentation Strategy

1. **REST Endpoints**: Use Swagger/OpenAPI for external integrations and webhook documentation
2. **tRPC Endpoints**: Rely on TypeScript types and comprehensive code comments
3. **Shared Types**: All API types are defined in the shared package for consistency
4. **Auto-Discovery**: tRPC endpoints are auto-discoverable via TypeScript IntelliSense

---

## 🔧 Development Tools

### Nx Commands

```bash
# Run any target for any project
nx <target> <project>

# Run commands for multiple projects
nx run-many -t <target>

# View project graph
nx graph

# Reset Nx cache
nx reset
```

### Code Quality

- **ESLint 9+** with flat config supporting both React and Node.js
- **TypeScript** with strict mode and type-aware linting
- **Prettier** for consistent code formatting
- **Husky** for git hooks
- **Lint-staged** for pre-commit linting

---

## 🧪 Testing

### Testing Strategy

- **Frontend**: Jest + React Testing Library + Factory-based test data
- **Backend**: Jest + NestJS testing utilities + Supertest
- **Integration**: Factory consistency validation across contexts
- **E2E**: Playwright for end-to-end testing

### Factory-Based Testing

Our testing uses dynamic factories for realistic, consistent test data:

```typescript
// Generate test data dynamically
const healthData = factories.healthCheck.success()
const customHealth = factories.healthCheck.withCustomMemory(512, 1024)
const prodHealth = factories.healthCheck.production()

// Same factories work across unit and integration tests
mockUseApi.mockReturnValue({
  data: factories.healthCheck.success(),
  isLoading: false,
  error: null,
  execute: jest.fn(),
})
```

### Environment-Specific Testing

- **Frontend**: Uses `frontend/src/env.ts` for frontend-specific variables
- **Backend**: Uses `backend/src/env.ts` for backend-specific variables
- **Shared**: Uses `packages/shared/src/env.ts` for truly shared variables

```bash
# Run all tests across the entire monorepo
pnpm test

# Run tests for specific projects
pnpm test:backend     # Backend tests only
pnpm test:frontend    # Frontend tests only
pnpm test:shared      # Shared package tests only

# Run tests in watch mode
pnpm test:watch       # All projects in watch mode
nx test backend --watch
nx test frontend --watch

# Run tests with coverage
nx test frontend --coverage
nx test backend --coverage

# Run E2E tests
nx e2e frontend-e2e

# Run integration tests specifically
nx test frontend --testPathPattern=integration
```

See [`frontend/src/test-utils/integration-test-example.md`](frontend/src/test-utils/integration-test-example.md) for detailed testing documentation.

---

## 🏗️ Building & Deployment

```bash
# Build for production
pnpm build

# Individual builds
nx build frontend --configuration=production
nx build backend --configuration=production

# Start production server (backend)
nx start:prod backend
```

### Environment Variables

Each part of the monorepo has its own environment configuration:

```bash
# Frontend environment (.env or deployment config)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_FEATURE_TRPC=true
NEXT_PUBLIC_DEBUG=false

# Backend environment (.env or deployment config)
DATABASE_URL=postgresql://user:pass@localhost:5432/db
PORT=3000
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Shared environment (automatically detected)
NODE_ENV=production
```

---

## 📦 Adding Dependencies

```bash
# Add to root (workspace tools)
pnpm add -w <package>

# Add to specific project
pnpm add <package> --filter frontend
pnpm add <package> --filter backend
```

---

## 🎨 UI Components (Frontend)

The frontend uses [shadcn/ui](https://ui.shadcn.com/docs) for reusable, accessible UI components.

```bash
# Add a new component
pnpm shadcn add button
pnpm shadcn add card
```

Components are automatically installed to `frontend/src/components/ui/`.

---

## 🏗️ Backend Code Generation

The backend uses the `@nx/nest` plugin for generating NestJS components:

```bash
# Generate components
pnpm exec nx g @nx/nest:controller users --project=backend
pnpm exec nx g @nx/nest:service users --project=backend
pnpm exec nx g @nx/nest:module users --project=backend

# Generate complete resources (with CRUD operations)
pnpm exec nx g @nx/nest:resource users --project=backend

# Other available generators
pnpm exec nx g @nx/nest:guard auth --project=backend
pnpm exec nx g @nx/nest:interceptor logging --project=backend
pnpm exec nx g @nx/nest:pipe validation --project=backend
pnpm exec nx g @nx/nest:filter exception --project=backend
```

All generators automatically follow NestJS conventions and integrate with the Nx workspace.

---

## 🔧 Configuration

- **ESLint**: `eslint.config.mjs` (flat config)
- **TypeScript**: `tsconfig.base.json` (base) + project-specific configs
- **Nx**: `nx.json` for workspace settings
- **Prettier**: `.prettierrc` for formatting rules

---

## 📚 Useful Resources

- [Nx Documentation](https://nx.dev) - Monorepo tools and best practices
- [Next.js Documentation](https://nextjs.org/docs) - Frontend framework
- [NestJS Documentation](https://docs.nestjs.com) - Backend framework
- [shadcn/ui Documentation](https://ui.shadcn.com/docs) - UI components
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - CSS framework
- [Playwright Documentation](https://playwright.dev/) - E2E testing

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `pnpm test`
4. Run linting: `pnpm lint`
5. Create a pull request

Please update relevant READMEs if you change project structure or conventions.

---

## ⚡ Performance Features

- **SWC** compilation for fast builds
- **Nx caching** for task optimization
- **pnpm** for efficient dependency management
- **Next.js** optimizations (Image, Font, Bundle optimization)
- **Incremental builds** and smart task execution
