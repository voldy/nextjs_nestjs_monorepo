import React from 'react'
import { renderWithProviders, screen } from '../../test-utils/test-utils'
import { factories } from '../../test-utils/factories'
import Home from '../page'

// Testing Strategy:
// - Unit tests: Mock hooks directly for fast, isolated component testing
// - Integration tests: Use factories for consistent, realistic data validation
// - Both approaches use the same factory-generated data for consistency

// Mock the API hooks for unit testing
jest.mock('../../hooks/use-api', () => ({
  useApi: jest.fn(),
}))

// Mock tRPC hooks for unit testing
jest.mock('../../lib/trpc', () => ({
  trpc: {
    health: {
      ping: {
        useQuery: jest.fn(),
      },
    },
  },
}))

import { useApi } from '../../hooks/use-api'
const mockUseApi = useApi as jest.MockedFunction<any>

import { trpc } from '../../lib/trpc'
const mockTrpcPing = trpc.health.ping.useQuery as jest.MockedFunction<any>

describe('Home page', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock tRPC ping hook to return a default state
    mockTrpcPing.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    })
  })

  describe('Basic rendering', () => {
    beforeEach(() => {
      // Mock successful API response using factories
      mockUseApi.mockReturnValue({
        data: factories.healthCheck.success(),
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        execute: jest.fn(),
      })
    })

    it('renders Notifications card', async () => {
      renderWithProviders(<Home />)
      expect(screen.getByText(/Save and see your changes instantly/i)).toBeInTheDocument()
    })

    it('renders shared package integration section', () => {
      renderWithProviders(<Home />)
      expect(screen.getByText('Shared Package Integration Test')).toBeInTheDocument()
    })

    it('renders health status with factory data', async () => {
      renderWithProviders(<Home />)

      expect(screen.getByText('Backend Health')).toBeInTheDocument()
      await screen.findByText('ok')
    })
  })

  describe('Health Check States', () => {
    it('shows health data with factory-generated data', async () => {
      // Generate health data with specific uptime
      const healthData = factories.healthCheck.success()
      const expectedMinutes = Math.floor(healthData.uptime / 60)
      const expectedSeconds = healthData.uptime % 60

      mockUseApi.mockReturnValue({
        data: healthData,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        execute: jest.fn(),
      })

      renderWithProviders(<Home />)

      // Wait for health data to load and check uptime display
      await screen.findByText(`${expectedMinutes}m ${expectedSeconds}s`)
    })

    it('shows health data with custom memory values', async () => {
      // Generate custom health data using factory
      const customHealth = factories.healthCheck.withCustomMemory(256, 1024)

      mockUseApi.mockReturnValue({
        data: customHealth,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        execute: jest.fn(),
      })

      renderWithProviders(<Home />)

      // Should show the custom memory values from factory
      await screen.findByText('256MB / 1024MB')
    })

    it('shows error state when API fails', async () => {
      mockUseApi.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: 'Internal server error',
        refetch: jest.fn(),
        execute: jest.fn(),
      })

      renderWithProviders(<Home />)

      // Should show error message
      await screen.findByText(/Internal server error/i)
    })

    it('shows loading state', async () => {
      mockUseApi.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
        execute: jest.fn(),
      })

      renderWithProviders(<Home />)

      // Should show loading indicator
      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })
  })

  describe('Generated Test Data', () => {
    it('uses factory-generated data for multiple scenarios', () => {
      // Generate multiple health checks with different data
      const health1 = factories.healthCheck.success()
      const health2 = factories.healthCheck.success()

      // Each factory call should generate different data
      expect(health1.uptime).not.toBe(health2.uptime)
      expect(health1.memory.used).not.toBe(health2.memory.used)
      expect(health1.timestamp).toBeDefined()
    })

    it('generates realistic ping data', () => {
      const ping1 = factories.ping.success()
      const ping2 = factories.ping.success(1000)

      expect(ping1.delay).toBe(500) // Default delay
      expect(ping2.delay).toBe(1000) // Custom delay
      expect(ping1.message).toBe('Pong! 🏓')
      expect(ping1.pong).toBe(true)
    })
  })
})
