// Mock tRPC client for testing
const mockRefetch = jest.fn().mockResolvedValue({
  data: {
    id: 'test-user-id',
    email: 'test@example.com',
    message: 'Successfully authenticated with Clerk!',
    timestamp: new Date().toISOString(),
  },
})

const mockUtils = {
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
}

export const trpc = {
  useUtils: jest.fn(() => mockUtils),
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
}

// Reset function for tests
export const resetTrpcMocks = () => {
  jest.clearAllMocks()
}
