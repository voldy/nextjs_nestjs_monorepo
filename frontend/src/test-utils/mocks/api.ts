import { factories, HealthCheckResponse, PingResponse } from '../factories'

// Mock builders for different states
export const mockStates = {
  loading: {
    data: undefined,
    isLoading: true,
    error: null,
    refetch: jest.fn(),
    execute: jest.fn(),
  },
  success: (data: any) => ({
    data,
    isLoading: false,
    error: null,
    refetch: jest.fn(),
    execute: jest.fn(),
  }),
  error: (errorMessage: string) => ({
    data: undefined,
    isLoading: false,
    error: errorMessage,
    refetch: jest.fn(),
    execute: jest.fn(),
  }),
} as const

// Mock factory for useApi hook using dynamic factories
export const createUseApiMock = (scenario: 'loading' | 'success' | 'error', data?: any, errorMessage?: string) => {
  switch (scenario) {
    case 'loading':
      return mockStates.loading
    case 'success':
      return mockStates.success(data || factories.healthCheck.success())
    case 'error':
      return mockStates.error(errorMessage || 'Health check failed')
    default:
      return mockStates.success(data)
  }
}

// Mock factory for tRPC hooks using dynamic factories
export const createTrpcMock = (scenario: 'loading' | 'success' | 'error', data?: any, errorMessage?: string) => {
  switch (scenario) {
    case 'loading':
      return {
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      }
    case 'success':
      return {
        data: data || factories.ping.success(),
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      }
    case 'error':
      return {
        data: undefined,
        isLoading: false,
        error: { message: errorMessage || 'Ping failed' },
        refetch: jest.fn(),
      }
    default:
      return {
        data: undefined,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      }
  }
}

// Mock setup helpers
export const setupMocks = {
  useApi: (mock: jest.MockedFunction<any>, scenario: Parameters<typeof createUseApiMock>) => {
    mock.mockReturnValue(createUseApiMock(...scenario))
  },
  trpcPing: (mock: jest.MockedFunction<any>, scenario: Parameters<typeof createTrpcMock>) => {
    mock.mockReturnValue(createTrpcMock(...scenario))
  },
}

// Factory-based fixtures for specific test scenarios
export const createFixture = {
  healthCheck: (overrides: Partial<HealthCheckResponse> = {}) => ({
    ...factories.healthCheck.success(),
    ...overrides,
  }),
  ping: (overrides: Partial<PingResponse> = {}) => ({
    ...factories.ping.success(),
    ...overrides,
  }),
  // Convenience methods for common scenarios
  healthCheckWithMemory: (used: number, total: number) => factories.healthCheck.withCustomMemory(used, total),
  healthCheckProduction: () => factories.healthCheck.success(),
  pingWithDelay: (delay: number) => factories.ping.success(delay),
}

// Pre-configured mock scenarios using factories
export const scenarios = {
  healthCheck: {
    loading: () => createUseApiMock('loading'),
    success: () => createUseApiMock('success', factories.healthCheck.success()),
    production: () => createUseApiMock('success', factories.healthCheck.success()),
    customMemory: (used: number, total: number) =>
      createUseApiMock('success', factories.healthCheck.withCustomMemory(used, total)),
    error: (message = 'Health check failed') => createUseApiMock('error', undefined, message),
  },
  ping: {
    loading: () => createTrpcMock('loading'),
    success: (delay = 500) => createTrpcMock('success', factories.ping.success(delay)),
    error: (message = 'Ping failed') => createTrpcMock('error', undefined, message),
  },
}
