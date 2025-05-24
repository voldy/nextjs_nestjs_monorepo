# @monorepo/shared

A shared utilities library for the monorepo, providing cross-platform utilities, environment configuration, and tRPC setup for both frontend (Next.js) and backend (NestJS) applications.

## 📁 Structure

```
src/
├── index.ts                    # Main export file
├── env/
│   └── env.ts                  # Shared environment variables (NODE_ENV only)
├── utils/
│   ├── shared.ts               # Example utility (can be removed)
│   ├── isBrowser.ts            # Browser detection utility
│   ├── sleep.ts                # Promise-based delay
│   ├── assertUnreachable.ts    # TypeScript exhaustive checking
│   ├── logger.ts               # Simple logging abstraction
│   ├── deepMerge.ts            # Deep object merging
│   └── *.spec.ts               # Test files
└── trpc/
    ├── index.ts                # tRPC exports
    ├── context.ts              # tRPC context setup
    ├── router.ts               # Main router
    ├── trpc.ts                 # tRPC instance
    └── routers/
        └── health.ts           # Health check router
```

## 🚀 Usage

Import utilities using the configured path alias:

```ts
import { isBrowser, sleep, assertUnreachable, logger, deepMerge, Env, appRouter } from '@shared'
```

## 🌍 Environment Management

### **Clean Architecture**: Environment variables are now properly separated by concern

#### Shared Environment (`packages/shared/src/env/env.ts`)

**Only truly shared variables** - minimal and focused:

```ts
import { Env } from '@shared'

// Only contains variables needed by both frontend and backend
console.log(`Environment: ${Env.NODE_ENV}`) // 'development' | 'test' | 'production'
```

#### Frontend Environment (`frontend/src/env.ts`)

Frontend-specific variables with smart defaults:

```ts
// Frontend-only environment variables
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_FEATURE_TRPC=true
NEXT_PUBLIC_DEBUG=false
```

#### Backend Environment (`backend/src/env.ts`)

Backend-specific variables for server configuration:

```ts
// Backend-only environment variables
DATABASE_URL=postgresql://user:pass@localhost:5432/db
PORT=3000
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

### **Benefits of This Approach**:

- ✅ **Clean Separation**: No pollution of frontend/backend concerns
- ✅ **Type Safety**: Zod validation for all environment variables
- ✅ **Deployment Ready**: Different deployment targets can have different env vars
- ✅ **Smart Defaults**: Automatic API URL detection for development vs production

## 🔗 tRPC Integration

End-to-end type-safe API communication:

```ts
import { appRouter, type AppRouter } from '@shared'

// The shared router provides type safety across frontend and backend
// Frontend uses this for tRPC client setup
// Backend exports this as the actual API router
```

## 🔍 Cross-Platform Utilities

### Browser Detection

```ts
import { isBrowser } from '@shared'

if (isBrowser()) {
  // This code only runs in the browser
  console.log('Client-side code')
  document.title = 'My App'
} else {
  // This code runs on the server
  console.log('Server-side code')
}
```

### Sleep Utility

```ts
import { sleep } from '@shared'

async function example() {
  console.log('Starting...')
  await sleep(1000) // Wait 1 second
  console.log('Done!')
}
```

### Exhaustive Type Checking

```ts
import { assertUnreachable } from '@shared'

type Status = 'loading' | 'success' | 'error'

function getStatusMessage(status: Status): string {
  switch (status) {
    case 'loading':
      return 'Please wait...'
    case 'success':
      return 'Operation completed!'
    case 'error':
      return 'Something went wrong'
    default:
      // TypeScript will ensure this is never reached
      // If you add a new status, you'll get a compile error
      return assertUnreachable(status)
  }
}
```

### Simple Logging

```ts
import { logger } from '@shared'

logger.log('User logged in', { userId: 123 })
logger.warn('API rate limit approaching', { remaining: 5 })
logger.error('Database connection failed', error)
```

### Deep Object Merging

```ts
import { deepMerge } from '@shared'

const defaultConfig = {
  api: { timeout: 5000, retries: 3 },
  ui: { theme: 'light' },
}

const userConfig = {
  api: { timeout: 10000 }, // Override timeout, keep retries
  ui: { animations: true }, // Add new property
}

const finalConfig = deepMerge(defaultConfig, userConfig)
// Result: {
//   api: { timeout: 10000, retries: 3 },
//   ui: { theme: 'light', animations: true }
// }
```

## 🛠️ Development

### Running Tests

```bash
pnpm nx test shared
```

### Building (for production)

```bash
pnpm nx build shared
```

### Linting

```bash
pnpm nx lint shared
```

## 💡 Development Notes

- **Hot Reloading**: Changes to shared utilities are picked up immediately in development (no build required)
- **Type Safety**: All utilities are fully typed with TypeScript
- **Cross-Platform**: Utilities work in both browser and Node.js environments
- **Test Coverage**: All utilities have comprehensive tests
- **Environment Separation**: Clean separation of frontend/backend/shared environment concerns
- **tRPC Integration**: End-to-end type safety with shared router types

## 🔧 Adding New Utilities

### For General Utilities

1. Create your utility file in `src/utils/`
2. Create a corresponding test file (e.g., `myUtil.spec.ts`)
3. Export from `src/index.ts`
4. Update this README with usage examples

### For tRPC Routes

1. Create new router in `src/trpc/routers/`
2. Add to main router in `src/trpc/router.ts`
3. Export types as needed

### For Environment Variables

**Shared variables** (rare): Add to `src/env/env.ts`
**Frontend variables**: Add to `frontend/src/env.ts`
**Backend variables**: Add to `backend/src/env.ts`

Example:

```ts
// src/utils/myUtil.ts
export function myUtil(input: string): string {
  return input.toUpperCase()
}

// src/utils/myUtil.spec.ts
import { myUtil } from './myUtil'

describe('myUtil', () => {
  it('should convert to uppercase', () => {
    expect(myUtil('hello')).toBe('HELLO')
  })
})

// src/index.ts
export { myUtil } from './utils/myUtil.ts'
```

## 🎯 Package Philosophy

This shared package follows the principle of **minimal, focused sharing**:

- **Only share what's truly reusable** across frontend and backend
- **Environment variables** are separated by concern (frontend/backend/shared)
- **Utilities** are cross-platform and well-tested
- **tRPC setup** provides end-to-end type safety
- **File organization** follows domain-based structure for clarity
