# @monorepo/shared

A shared utilities library for the monorepo, providing cross-platform utilities and environment configuration for both frontend (Next.js) and backend (NestJS) applications.

## 📁 Structure

```
src/
├── index.ts                    # Main export file
├── env.ts                      # Environment validation with Zod
└── lib/
    ├── shared.ts               # Example utility (can be removed)
    ├── isBrowser.ts            # Browser detection utility
    ├── sleep.ts                # Promise-based delay
    ├── assertUnreachable.ts    # TypeScript exhaustive checking
    ├── logger.ts               # Simple logging abstraction
    └── deepMerge.ts            # Deep object merging
```

## 🚀 Usage

Import utilities using the configured path alias:

```ts
import { isBrowser, sleep, assertUnreachable, logger, deepMerge } from '@/shared'
```

### 🌍 Environment Configuration

```ts
import { Env } from '@/shared'

// Automatically validates environment variables on import
console.log(`Running on port: ${Env.PORT}`)
console.log(`Environment: ${Env.NODE_ENV}`)
console.log(`Database: ${Env.DATABASE_URL}`)
```

### 🔍 Browser Detection

```ts
import { isBrowser } from '@/shared'

if (isBrowser()) {
  // This code only runs in the browser
  console.log('Client-side code')
  document.title = 'My App'
} else {
  // This code runs on the server
  console.log('Server-side code')
}
```

### ⏰ Sleep Utility

```ts
import { sleep } from '@/shared'

async function example() {
  console.log('Starting...')
  await sleep(1000) // Wait 1 second
  console.log('Done!')
}
```

### 🔒 Exhaustive Type Checking

```ts
import { assertUnreachable } from '@/shared'

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

### 📝 Simple Logging

```ts
import { logger } from '@/shared'

logger.log('User logged in', { userId: 123 })
logger.warn('API rate limit approaching', { remaining: 5 })
logger.error('Database connection failed', error)
```

### 🔀 Deep Object Merging

```ts
import { deepMerge } from '@/shared'

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
pnpm nx eslint:lint shared
```

## 💡 Development Notes

- **Hot Reloading**: Changes to shared utilities are picked up immediately in development (no build required)
- **Type Safety**: All utilities are fully typed with TypeScript
- **Cross-Platform**: Utilities work in both browser and Node.js environments
- **Test Coverage**: All utilities have comprehensive tests

## 🔧 Adding New Utilities

1. Create your utility file in `src/lib/`
2. Create a corresponding test file (e.g., `myUtil.spec.ts`)
3. Export from `src/index.ts`
4. Update this README with usage examples

Example:

```ts
// src/lib/myUtil.ts
export function myUtil(input: string): string {
  return input.toUpperCase()
}

// src/lib/myUtil.spec.ts
import { myUtil } from './myUtil'

describe('myUtil', () => {
  it('should convert to uppercase', () => {
    expect(myUtil('hello')).toBe('HELLO')
  })
})

// src/index.ts
export * from './lib/myUtil'
```
