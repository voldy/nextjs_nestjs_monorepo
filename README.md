# Next.js + NestJS Monorepo

A modern full-stack monorepo powered by [Nx](https://nx.dev) and [pnpm](https://pnpm.io/), featuring a Next.js frontend and NestJS backend with shared tooling and optimized development experience.

---

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, shadcn/ui
- **Backend**: NestJS 11, Node.js, TypeScript
- **Monorepo**: Nx 21.x for task orchestration and caching
- **Package Manager**: pnpm for fast, efficient dependency management
- **Linting**: ESLint 9+ with flat config, TypeScript-aware rules
- **Testing**: Jest with React Testing Library (frontend) and NestJS testing utilities (backend)
- **Build**: SWC for fast compilation on both frontend and backend
- **Formatting**: Prettier with automatic formatting
- **Nx Plugins**: @nx/next (frontend), @nx/nest (backend), @nx/playwright (E2E)

---

## 📁 Project Structure

```
├── frontend/          # Next.js 15 application
│   ├── src/
│   │   ├── app/       # App Router (Next.js 15)
│   │   ├── components/ # Reusable components (shadcn/ui)
│   │   └── lib/       # Utilities and helpers
│   ├── project.json   # Nx project configuration
│   └── README.md
├── backend/           # NestJS 11 API server
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   └── main.ts
│   ├── test/          # End-to-end tests
│   ├── project.json   # Nx project configuration
│   └── README.md
├── frontend-e2e/      # Playwright end-to-end tests
├── nx.json            # Nx workspace configuration
├── eslint.config.mjs  # ESLint flat config for both projects
├── tsconfig.base.json # Base TypeScript configuration
└── package.json       # Root workspace configuration
```

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
pnpm build            # Build both apps for production
pnpm test             # Run tests for all projects
pnpm lint             # Lint all projects with ESLint
```

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
```

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

- **Frontend**: Jest + React Testing Library + JSDOM
- **Backend**: Jest + NestJS testing utilities + Supertest
- **E2E**: Playwright for end-to-end testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
nx test frontend --coverage
nx test backend --coverage

# Run E2E tests
nx e2e frontend-e2e
```

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
