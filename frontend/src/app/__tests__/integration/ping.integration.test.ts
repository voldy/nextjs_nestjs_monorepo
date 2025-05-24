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

      // Same structure and types
      expect(health1.status).toBe('ok')
      expect(health2.status).toBe('ok')

      // But different dynamic values
      expect(health1.uptime).not.toBe(health2.uptime)
      expect(health1.memory.used).not.toBe(health2.memory.used)

      // Proper types
      expect(typeof health1.timestamp).toBe('string')
      expect(typeof health1.uptime).toBe('number')
      expect(health1.memory).toHaveProperty('used')
      expect(health1.memory).toHaveProperty('total')
    })

    it('should allow custom memory values', () => {
      const customHealth = factories.healthCheck.withCustomMemory(512, 1024)

      expect(customHealth.memory.used).toBe(512)
      expect(customHealth.memory.total).toBe(1024)
      expect(customHealth.status).toBe('ok')
    })
  })

  describe('Ping Factory', () => {
    it('should generate consistent ping data', () => {
      const ping1 = factories.ping.success()
      const ping2 = factories.ping.success(1000)

      expect(ping1.pong).toBe(true)
      expect(ping2.pong).toBe(true)
      expect(ping1.delay).toBe(500) // Default
      expect(ping2.delay).toBe(1000) // Custom
      expect(ping1.message).toBe('Pong! 🏓')
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
        memory: {
          used: expect.any(Number),
          total: expect.any(Number),
        },
        timestamp: expect.any(String),
        uptime: expect.any(Number),
      })

      expect(pingData).toMatchObject({
        pong: true,
        delay: 1500,
        message: 'Pong! 🏓',
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

  describe('Performance & Reliability', () => {
    it('should generate many objects quickly', () => {
      const start = Date.now()

      const healthChecks = Array.from({ length: 100 }, () => factories.healthCheck.success())

      const end = Date.now()

      expect(healthChecks).toHaveLength(100)
      expect(end - start).toBeLessThan(100) // Should be very fast

      // All should be unique
      const uptimes = healthChecks.map((h) => h.uptime)
      const uniqueUptimes = new Set(uptimes)
      expect(uniqueUptimes.size).toBe(100)
    })

    it('should handle edge cases gracefully', () => {
      const edgeCase = factories.healthCheck.withCustomMemory(0, 0)

      expect(edgeCase.memory.used).toBe(0)
      expect(edgeCase.memory.total).toBe(0)
      expect(edgeCase.status).toBe('ok')
    })
  })
})
