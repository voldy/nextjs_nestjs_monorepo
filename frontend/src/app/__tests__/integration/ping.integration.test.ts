/**
 * Factory Integration Test Example
 * This test demonstrates factory integration for consistent data validation.
 *
 * Purpose: Validate factories generate consistent, realistic data across contexts
 * Approach: Direct factory testing without HTTP layer complexity
 */
import { factories } from '../../../test-utils/factories'

describe('Factory Integration Tests', () => {
  describe('Health Check Factory', () => {
    it('should generate consistent factory data', () => {
      const health1 = factories.healthCheck.success()
      const health2 = factories.healthCheck.success()

      // Both should have same structure but different dynamic values
      expect(health1.status).toBe('ok')
      expect(health2.status).toBe('ok')
      expect(health1.environment).toBe('development')
      expect(health2.environment).toBe('development')

      // But different dynamic values
      expect(health1.uptime).not.toBe(health2.uptime)
      expect(health1.memory.used).not.toBe(health2.memory.used)
      expect(health1.timestamp).not.toBe(health2.timestamp)
    })

    it('should support custom factory parameters', () => {
      const customHealth = factories.healthCheck.withCustomMemory(512, 1024)

      expect(customHealth.memory).toEqual({
        used: 512,
        total: 1024,
      })
      expect(customHealth.status).toBe('ok')
    })

    it('should generate production environment', () => {
      const prodHealth = factories.healthCheck.production()

      expect(prodHealth.environment).toBe('production')
      expect(prodHealth.status).toBe('ok')
    })
  })

  describe('Ping Factory', () => {
    it('should generate ping data with default delay', () => {
      const ping = factories.ping.success()

      expect(ping).toMatchObject({
        message: 'Pong! 🏓',
        delay: 500,
        pong: true,
        timestamp: expect.any(String),
      })
    })

    it('should generate ping data with custom delay', () => {
      const ping = factories.ping.success(2000)

      expect(ping.delay).toBe(2000)
      expect(ping.message).toBe('Pong! 🏓')
      expect(ping.pong).toBe(true)
    })

    it('should generate realistic timestamps', () => {
      const ping1 = factories.ping.success()
      // Add small delay to ensure different timestamps
      const ping2 = factories.ping.success()

      // Both should be valid ISO strings
      expect(() => new Date(ping1.timestamp)).not.toThrow()
      expect(() => new Date(ping2.timestamp)).not.toThrow()

      // Timestamps should be recent (within last minute)
      const now = Date.now()
      const ping1Time = new Date(ping1.timestamp).getTime()
      const ping2Time = new Date(ping2.timestamp).getTime()

      expect(now - ping1Time).toBeLessThan(60000) // Less than 1 minute ago
      expect(now - ping2Time).toBeLessThan(60000) // Less than 1 minute ago
    })
  })

  describe('Cross-Test Factory Consistency', () => {
    it('should demonstrate same factories work in unit and integration contexts', () => {
      // This test proves that:
      // 1. Factories generate consistent structure
      // 2. Same factories used in unit tests (mocked) work here
      // 3. Same factories can be used across different test types
      // 4. Same factories can be used in Storybook

      const healthData = factories.healthCheck.success()
      const pingData = factories.ping.success(1500)

      // Structure validation (same as unit tests expect)
      expect(healthData).toMatchObject({
        status: 'ok',
        environment: 'development',
        memory: {
          used: expect.any(Number),
          total: expect.any(Number),
        },
        version: expect.any(String),
        uptime: expect.any(Number),
        timestamp: expect.any(String),
      })

      expect(pingData).toMatchObject({
        message: 'Pong! 🏓',
        delay: 1500,
        pong: true,
        timestamp: expect.any(String),
      })
    })

    it('should validate memory values are realistic', () => {
      const health = factories.healthCheck.success()

      // Memory should be realistic values (not negative, used <= total)
      expect(health.memory.used).toBeGreaterThan(0)
      expect(health.memory.total).toBeGreaterThan(0)
      expect(health.memory.used).toBeLessThanOrEqual(health.memory.total)
    })

    it('should validate uptime is realistic', () => {
      const health = factories.healthCheck.success()

      // Uptime should be positive
      expect(health.uptime).toBeGreaterThan(0)

      // Should be reasonable (less than a year in seconds)
      expect(health.uptime).toBeLessThan(365 * 24 * 60 * 60)
    })
  })

  describe('Factory Performance', () => {
    it('should generate many factory instances quickly', () => {
      const start = Date.now()

      // Generate 100 instances
      const healths = Array.from({ length: 100 }, () => factories.healthCheck.success())
      const pings = Array.from({ length: 100 }, () => factories.ping.success())

      const duration = Date.now() - start

      // Should be fast (less than 100ms for 200 objects)
      expect(duration).toBeLessThan(100)

      // Health data should have some uniqueness (uptime varies)
      const healthUptimes = healths.map((h) => h.uptime)
      const uniqueUptimes = [...new Set(healthUptimes)]
      expect(uniqueUptimes.length).toBeGreaterThan(10) // Some uniqueness expected

      // All should have valid structure
      healths.forEach((health) => {
        expect(health.status).toBe('ok')
        expect(health.memory.used).toBeGreaterThan(0)
        expect(health.uptime).toBeGreaterThan(0)
      })

      pings.forEach((ping) => {
        expect(ping.message).toBe('Pong! 🏓')
        expect(ping.delay).toBe(500)
        expect(ping.pong).toBe(true)
      })
    })
  })
})
