import { Factory } from 'fishery'

// Health Check Response Factory
export interface HealthCheckResponse {
  status: 'ok' | 'error'
  timestamp: string
  uptime: number
  environment: 'development' | 'production' | 'test'
  memory: {
    used: number
    total: number
  }
  version: string
}

export const healthCheckFactory = Factory.define<HealthCheckResponse>(({ sequence }) => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  uptime: sequence * 1000 + 12345,
  environment: 'development',
  memory: {
    used: 128 + sequence * 10,
    total: 512,
  },
  version: 'v18.0.0',
}))

// Ping Response Factory
export interface PingResponse {
  message: string
  delay: number
  timestamp: string
  pong: boolean
}

export const pingFactory = Factory.define<PingResponse>(({ sequence }) => ({
  message: 'Pong! 🏓',
  delay: 500 + sequence * 100,
  timestamp: new Date().toISOString(),
  pong: true,
}))

// Error Response Factory
export interface ErrorResponse {
  error: string
  code?: number
  details?: unknown
}

export const errorFactory = Factory.define<ErrorResponse>(() => ({
  error: 'Something went wrong',
  code: 500,
}))

// Hook State Factories (for mocking React Query/tRPC hooks)
export interface HookState<T> {
  data: T | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
  execute?: () => void
}

// Quick factory builders for common scenarios
export const factories = {
  // Health check scenarios
  healthCheck: {
    success: () => healthCheckFactory.build(),
    withCustomMemory: (used: number, total: number) => healthCheckFactory.build({ memory: { used, total } }),
    production: () => healthCheckFactory.build({ environment: 'production' }),
  },

  // Ping scenarios
  ping: {
    success: (delay = 500) => pingFactory.build({ delay }),
  },

  // Error scenarios
  error: (message = 'Something went wrong', code = 500) => errorFactory.build({ error: message, code }),
}
