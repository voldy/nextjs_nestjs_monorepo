/* global jest */
import '@testing-library/jest-dom'

// Set up test environment variables for frontend testing
process.env.NODE_ENV = 'test'
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_FEATURE_TRPC = 'true'
process.env.NEXT_PUBLIC_DEBUG = 'false'

// Mock Clerk - temporarily commented out due to module resolution issues
// jest.mock('@clerk/nextjs', () => require('./src/test-utils/mocks/clerk'))
// jest.mock('@clerk/nextjs/server', () => require('./src/test-utils/mocks/clerk'))

// Mock tRPC
jest.mock('./src/lib/trpc', () => {
  const mockRefetch = jest.fn().mockResolvedValue({
    data: {
      id: 'test-user-id',
      email: 'test@example.com',
      message: 'Successfully authenticated with Clerk!',
      timestamp: new Date().toISOString(),
    },
  })

  return {
    trpc: {
      useUtils: jest.fn(() => ({
        auth: {
          me: {
            fetch: jest.fn().mockResolvedValue({
              id: 'test-user-id',
              email: 'test@example.com',
              message: 'Successfully authenticated with Clerk!',
              timestamp: new Date().toISOString(),
            }),
          },
        },
      })),
      auth: {
        me: {
          useMutation: jest.fn(() => ({
            mutate: jest.fn(),
            isLoading: false,
            error: null,
          })),
          useQuery: jest.fn(() => ({
            data: {
              id: 'test-user-id',
              email: 'test@example.com',
              message: 'Successfully authenticated with Clerk!',
              timestamp: new Date().toISOString(),
            },
            isLoading: false,
            error: null,
            refetch: mockRefetch,
          })),
        },
      },
      health: {
        check: {
          useQuery: jest.fn(() => ({
            data: {
              status: 'healthy',
              timestamp: new Date().toISOString(),
              uptime: 12345,
              memory: { used: 50, total: 100 },
            },
            isLoading: false,
            error: null,
          })),
        },
        ping: {
          useMutation: jest.fn(() => ({
            mutate: jest.fn(),
            isLoading: false,
            error: null,
          })),
        },
      },
    },
  }
})

console.log('Jest setup complete. Frontend test environment configured.')
