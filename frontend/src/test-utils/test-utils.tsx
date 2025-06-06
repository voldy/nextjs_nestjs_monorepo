import React from 'react'
import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import userEvent from '@testing-library/user-event'

// Mock ClerkProvider for testing
const MockClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="mock-clerk-provider">{children}</div>
}

// Create a test-optimized QueryClient
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
}

// Enhanced render function with all providers
export function renderWithProviders(
  ui: React.ReactElement,
  { queryClient = createTestQueryClient(), ...renderOptions }: CustomRenderOptions = {},
): RenderResult & {
  queryClient: QueryClient
  user: ReturnType<typeof userEvent.setup>
} {
  const user = userEvent.setup()

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MockClerkProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </MockClerkProvider>
    )
  }

  return {
    user,
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { userEvent }
