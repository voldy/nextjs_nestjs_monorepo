# Integration Testing Strategy

This document explains our testing strategy and current implementation.

## Current Setup

### ✅ Factory Integration Testing

- **Location**: `frontend/src/app/__tests__/integration/`
- **Purpose**: Test factory consistency across different contexts
- **Status**: **Working** - All tests pass
- **Use Case**: Validate that factories generate consistent, realistic data

### ✅ Environment Architecture

- **Status**: **Refactored** - Clean separation of concerns
- **Frontend**: `frontend/src/env.ts` - API URLs, feature flags, frontend-specific vars
- **Backend**: `backend/src/env.ts` - DATABASE_URL, server config, backend-specific vars
- **Shared**: `packages/shared/src/env.ts` - Only truly shared variables (NODE_ENV)

## Testing Architecture

```
Test Types:
├── Unit Tests (Fast, Isolated)
│   ├── Direct hook mocking
│   ├── Component testing
│   └── Uses factories for data
│
├── Factory Integration Tests (Fast, Realistic Data)
│   ├── Factory consistency validation
│   ├── Cross-context factory usage
│   └── Performance testing
│
└── Future HTTP Integration Tests
    ├── Consider native fetch mocking
    ├── Or real server integration tests
    └── Use same factory-generated data
```

## Environment Variable Architecture

### Shared Package (`packages/shared/src/env.ts`)

```typescript
// Only truly shared variables
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
})
```

### Frontend Environment (`frontend/src/env.ts`)

```typescript
// Frontend-specific variables
const frontendEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_FEATURE_TRPC: z
    .string()
    .transform((s) => s === 'true')
    .default('true'),
  NEXT_PUBLIC_DEBUG: z
    .string()
    .transform((s) => s === 'true')
    .default('false'),
  // ... other frontend vars
})

export const FrontendEnv = {
  ...SharedEnv,
  ..._frontendEnv.data,
  get API_URL(): string {
    /* computed property */
  },
}
```

### Backend Environment (`backend/src/env.ts`)

```typescript
// Backend-specific variables
const backendEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z
    .string()
    .transform((s) => parseInt(s, 10))
    .default('3000'),
  BACKEND_HOST: z.string().default('http://localhost'),
  // ... other backend vars
})

export const BackendEnv = {
  ...SharedEnv,
  ..._backendEnv.data,
  get BACKEND_URL(): string {
    /* computed property */
  },
}
```

## Current Working Examples

### 1. Unit Testing with Factories

```typescript
// frontend/src/app/__tests__/page.test.tsx
const customHealth = factories.healthCheck.withCustomMemory(256, 1024)
mockUseApi.mockReturnValue({
  data: customHealth,
  isLoading: false,
  error: null,
  execute: jest.fn(),
})
```

### 2. Factory Integration Testing

```typescript
// frontend/src/app/__tests__/integration/ping.integration.test.ts
it('should demonstrate factory consistency', () => {
  const healthData = factories.healthCheck.success()
  const pingData = factories.ping.success(1500)

  expect(healthData.status).toBe('ok')
  expect(pingData.delay).toBe(1500)
})
```

### 3. Environment Usage

```typescript
// Frontend
import { FrontendEnv } from '../env.js'
console.log('API URL:', FrontendEnv.API_URL)
console.log('Debug mode:', FrontendEnv.NEXT_PUBLIC_DEBUG)

// Backend
import { BackendEnv } from './env.js'
console.log('Database:', BackendEnv.DATABASE_URL)
console.log('Server port:', BackendEnv.PORT)
```

## Benefits of Current Approach

### Environment Separation

- ✅ **Clean Architecture**: Frontend and backend have separate environment concerns
- ✅ **Deployment Ready**: Different deployment targets can have different env vars
- ✅ **Type Safety**: Zod validation for all environment variables
- ✅ **No Pollution**: Shared package only contains truly shared variables

### Factory-Based Testing

- ✅ **Consistent**: Same data generators across all test types
- ✅ **Realistic**: Generated data matches production patterns
- ✅ **Fast**: No network overhead or complex mocking setup
- ✅ **Maintainable**: Single source of truth for test data

### Development Experience

- ✅ **Simple**: No complex setup required for HTTP mocking
- ✅ **Fast**: Tests run quickly without network mocking overhead
- ✅ **Reliable**: No external dependencies or module resolution issues

## Example Test Run Results

```bash
✓ Unit Tests: 9 tests passing (mocked hooks + factories)
✓ Factory Integration: 10 tests passing (factory validation)
✓ Environment: Clean separation (frontend/backend/shared)
✓ Build: All TypeScript compilation successful
✓ Lint: No ESLint errors
```

## Future HTTP Integration Testing

When HTTP integration testing is needed, consider:

### Option 1: Native Fetch Mocking

```typescript
global.fetch = jest.fn((url: string) => {
  if (url.includes('/health')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(factories.healthCheck.success()),
    } as Response)
  }
})
```

### Option 2: Real Server Testing

```typescript
// Start actual backend for integration tests
describe('Real Integration Tests', () => {
  beforeAll(async () => {
    serverUrl = await setupTestServer()
  })

  it('should ping real server', async () => {
    const response = await fetch(`${serverUrl}/health`)
    expect(response.ok).toBe(true)
  })
})
```

## Summary

- **Environment**: ✅ **Properly separated** (frontend/backend/shared)
- **Testing**: ✅ **Factory-based** with integration validation
- **Dependencies**: ✅ **Cleaned up** (simplified architecture)
- **Architecture**: ✅ **Deployment ready** with separate concerns
