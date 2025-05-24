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
- **Backend**: NestJS 11, Node.js, TypeScript, Fastify
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

├── frontend/ # Next.js 15 application
│ ├── src/
│ │ ├── app/ # App Router (Next.js 15)
│ │ ├── components/ # Reusable components (shadcn/ui)
│ │ └── lib/ # Utilities and helpers
│ ├── project.json # Nx project configuration
│ └── README.md
├── backend/ # NestJS 11 API server
│ ├── src/
│ │ ├── app.module.ts
│ │ ├── app.controller.ts
│ │ └── main.ts
│ ├── test/ # End-to-end tests
│ ├── project.json # Nx project configuration
│ └── README.md
├── packages/
│ └── shared/ # Shared utilities library
│ ├── src/
│ │ ├── index.ts # Main exports
│ │ ├── env.ts # Environment validation (Zod)
│ │ └── lib/ # Utility functions
│ ├── project.json # Nx project configuration
│ └── README.md
├── frontend-e2e/ # Playwright end-to-end tests
├── nx.json # Nx workspace configuration
├── eslint.config.mjs # ESLint flat config for all projects
├── tsconfig.base.json # Base TypeScript configuration
└── package.json # Root workspace configuration

---

## 📦 Shared Package

The monorepo includes a shared utilities library (`@shared`) that provides:

- **Environment validation** with Zod schema validation
- **Cross-platform utilities** (browser detection, logging, etc.)
- **Type-safe imports** across frontend and backend
- **Hot reloading** in development mode

### Usage Example

````typescript
// In frontend (Next.js) or backend (NestJS)
import { Env, logger, isBrowser, deepMerge } from '@shared'

// Environment variables (validated with Zod)
console.log(`Running on port: ${Env.PORT}`)
console.log(`Environment: ${Env.NODE_ENV}`)

// Cross-platform utilities
if (isBrowser()) {
  logger.log('Running in browser')
} else {
  logger.log('Running on server')
}

// Deep object merging
const merged = deepMerge(defaultConfig, userConfig)

See [`packages/shared/README.md`](packages/shared/README.md) for detailed documentation.

---

## ⚙️ Configuration & Tooling

### TypeScript Configuration

- **Base config**: `tsconfig.base.json` with modern `moduleResolution: "NodeNext"`
- **Project references**: Proper TypeScript project references for fast builds
- **Path mapping**: `@shared` imports work across all projects
- **Extensionless imports**: Clean import syntax without `.js`/`.ts` extensions

### ESLint Configuration

- **Flat config**: Modern ESLint 9+ configuration in `eslint.config.mjs`
- **ProjectService**: Automatic TypeScript project discovery (`projectService: true`)
- **Project references support**: Works with complex monorepo TypeScript setups
- **Consistent rules**: Same linting rules across frontend, backend, and shared package

### Jest Testing

- **Shared package support**: Jest configured to resolve `@shared` imports
- **Module mapping**: Automatic `.js` to `.ts` resolution for testing
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
````

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

````bash
pnpm dev              # Start both apps in development mode
pnpm build            # Build both apps for production
pnpm test             # Run tests for all projects
pnpm lint             # Lint all projects with ESLint

### Individual Project Scripts

```bash
# Frontend
pnpm dev:frontend     # Start Next.js dev server
nx build frontend     # Build frontend for production
nx test frontend      # Run frontend tests
nx lint frontend      # Lint frontend code

# Backend
pnpm dev:backend      # Start NestJS dev server with watch mode
nx build backend      # Build backend for production
nx test backend       # Run backend tests
nx lint backend       # Lint backend code
nx start backend      # Start built backend in production mode

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

### Environment-Specific Testing

- **Frontend**: Uses `frontend/src/env.ts` for frontend-specific variables
- **Backend**: Uses `backend/src/env.ts` for backend-specific variables
- **Shared**: Uses `packages/shared/src/env.ts` for truly shared variables

```bash
# Run all tests
pnpm test

# Run tests with coverage
nx test frontend --coverage
nx test backend --coverage

# Run E2E tests
nx e2e frontend-e2e

# Run integration tests specifically
nx test frontend --testPathPattern=integration

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

---

## 📦 Adding Dependencies

```bash
# Add to root (workspace tools)
pnpm add -w <package>

# Add to specific project
pnpm add <package> --filter frontend
pnpm add <package> --filter backend

---

## 🎨 UI Components (Frontend)

The frontend uses [shadcn/ui](https://ui.shadcn.com/docs) for reusable, accessible UI components.

```bash
# Add a new component
pnpm shadcn add button
pnpm shadcn add card

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
````
