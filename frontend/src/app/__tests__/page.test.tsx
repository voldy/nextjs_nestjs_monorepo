import React from 'react'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from '../page'

// Mock the useApi hook instead of tRPC for health status
jest.mock('@/hooks/use-api', () => ({
  useApi: jest.fn(),
}))

// Mock the tRPC client for ping button
jest.mock('@/lib/trpc', () => ({
  trpc: {
    health: {
      ping: {
        useQuery: jest.fn(),
      },
    },
  },
}))

// Import after mocking to get the mocked versions
import { useApi } from '@/hooks/use-api'
import { trpc } from '@/lib/trpc'

// Get the mocked functions
const mockUseApi = useApi as jest.MockedFunction<typeof useApi>
const mockHealthPingUseQuery = trpc.health.ping.useQuery as jest.MockedFunction<any>

// Test fixtures
const healthCheckFixture = {
  status: 'ok' as const,
  timestamp: '2024-01-01T00:00:00.000Z',
  uptime: 12345,
  environment: 'development' as const,
  memory: {
    used: 128,
    total: 512,
  },
  version: 'v18.0.0',
}

// Test wrapper with QueryClient
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('Home page', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()

    // Default mock implementations
    mockUseApi.mockReturnValue({
      data: healthCheckFixture,
      isLoading: false,
      error: null,
      execute: jest.fn(),
      refetch: jest.fn(),
    })

    mockHealthPingUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })
  })

  it('renders Notifications card', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>,
    )
    expect(screen.getByText(/Save and see your changes instantly/i)).toBeInTheDocument()
  })

  it('renders shared package integration section', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>,
    )
    expect(screen.getByText('Shared Package Integration Test')).toBeInTheDocument()
  })

  it('renders tRPC integration section with health status', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>,
    )
    expect(screen.getByText('tRPC API Integration')).toBeInTheDocument()
    expect(screen.getByText('Health Check')).toBeInTheDocument()
    expect(screen.getByText('Ping Test')).toBeInTheDocument()

    // Should show the health status from fixture (just "ok", not "Status: ok")
    expect(screen.getByText('ok')).toBeInTheDocument()
    expect(screen.getByText('Backend Health')).toBeInTheDocument()
  })

  it('shows loading state for health check', () => {
    mockUseApi.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      execute: jest.fn(),
      refetch: jest.fn(),
    })

    render(
      <TestWrapper>
        <Home />
      </TestWrapper>,
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows error state for health check', () => {
    mockUseApi.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: 'Health check failed',
      execute: jest.fn(),
      refetch: jest.fn(),
    })

    render(
      <TestWrapper>
        <Home />
      </TestWrapper>,
    )

    expect(screen.getByText(/Health check failed/)).toBeInTheDocument()
  })
})
