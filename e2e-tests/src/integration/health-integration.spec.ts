import { test, expect } from '@playwright/test'
import { TestHelpers } from '../utils/test-helpers'

test.describe('Health System Integration', () => {
  let helpers: TestHelpers

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page)

    // Navigate to frontend
    await page.goto('/')
    await helpers.waitForPageLoad()
  })

  test('ping-pong: complete round-trip test', async ({ page }) => {
    // Test the actual ping procedure that exists
    const pingResult = await page.evaluate(async () => {
      const startTime = Date.now()

      try {
        const input = encodeURIComponent(JSON.stringify({ delay: 100 }))
        const response = await fetch(`/api/trpc/health.ping?input=${input}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = (await response.json()) as any
        const endTime = Date.now()

        return {
          success: true,
          data: data.result?.data?.json || data.result?.data || data,
          roundTripTime: endTime - startTime,
          status: response.status,
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          roundTripTime: Date.now() - startTime,
        }
      }
    })

    // Verify the ping was successful
    expect(pingResult.success).toBe(true)
    expect(pingResult.data).toHaveProperty('pong', true)
    expect(pingResult.data).toHaveProperty('delay', 100)
    expect(pingResult.data).toHaveProperty('timestamp')
    expect(pingResult.data).toHaveProperty('message', '🏓 Pong from tRPC server!')

    // Verify reasonable response time (should be > 100ms due to delay)
    expect(pingResult.roundTripTime).toBeGreaterThan(90)
    expect(pingResult.roundTripTime).toBeLessThan(5000)
  })

  test('health check: system status verification', async ({ page }) => {
    // Test the health check procedure
    const healthResult = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/trpc/health.check', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = (await response.json()) as any

        return {
          success: true,
          data: data.result?.data?.json || data.result?.data || data,
          status: response.status,
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        }
      }
    })

    // Verify health check response
    expect(healthResult.success).toBe(true)
    expect(healthResult.data).toHaveProperty('status', 'ok')
    expect(healthResult.data).toHaveProperty('timestamp')
    expect(healthResult.data).toHaveProperty('uptime')
    expect(healthResult.data).toHaveProperty('environment')
    expect(healthResult.data).toHaveProperty('memory')
    expect(healthResult.data).toHaveProperty('version')

    // Verify memory object structure
    expect(healthResult.data.memory).toHaveProperty('used')
    expect(healthResult.data.memory).toHaveProperty('total')
    expect(typeof healthResult.data.memory.used).toBe('number')
    expect(typeof healthResult.data.memory.total).toBe('number')
  })

  test('echo: data integrity verification', async ({ page }) => {
    const testMessage = 'Hello from E2E integration test! 🚀'

    const echoResult = await page.evaluate(async (message) => {
      try {
        const input = encodeURIComponent(JSON.stringify({ message }))
        const response = await fetch(`/api/trpc/health.echo?input=${input}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = (await response.json()) as any

        return {
          success: true,
          data: data.result?.data?.json || data.result?.data || data,
          status: response.status,
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        }
      }
    }, testMessage)

    // Verify echo response
    expect(echoResult.success).toBe(true)
    expect(echoResult.data).toHaveProperty('echo', testMessage)
    expect(echoResult.data).toHaveProperty('timestamp')

    // Verify timestamp is recent (within last 10 seconds)
    const timestamp = new Date(echoResult.data.timestamp)
    const now = new Date()
    const timeDiff = now.getTime() - timestamp.getTime()
    expect(timeDiff).toBeLessThan(10000)
  })

  test('rate limiting: verify protection mechanisms', async ({ page }) => {
    // Test rate limiting on the ping endpoint (which has rateLimitedProcedure)
    const rateLimitResult = await page.evaluate(async () => {
      const results = []

      // Send multiple rapid requests to trigger rate limiting
      for (let i = 0; i < 25; i++) {
        try {
          const input = encodeURIComponent(JSON.stringify({ delay: 10 }))
          const response = await fetch(`/api/trpc/health.ping?input=${input}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })

          results.push({
            attempt: i + 1,
            status: response.status,
            success: response.ok,
          })
        } catch (error) {
          results.push({
            attempt: i + 1,
            status: 0,
            success: false,
            error: error instanceof Error ? error.message : String(error),
          })
        }

        // Small delay to avoid overwhelming the browser
        if (i % 5 === 0 && i > 0) {
          await new Promise((resolve) => globalThis.setTimeout(resolve, 50))
        }
      }

      return {
        results,
        totalRequests: results.length,
        successfulRequests: results.filter((r) => r.success).length,
        rateLimitedRequests: results.filter((r) => r.status === 429).length,
      }
    })

    // Verify that some requests succeeded
    expect(rateLimitResult.successfulRequests).toBeGreaterThan(0)

    // Verify that rate limiting eventually kicked in
    expect(rateLimitResult.rateLimitedRequests).toBeGreaterThan(0)

    // Total should be 25
    expect(rateLimitResult.totalRequests).toBe(25)
  })

  test('error handling: invalid requests', async ({ page }) => {
    // Test various error scenarios
    const errorTests = await page.evaluate(async () => {
      const tests = []

      // Test 1: Invalid procedure
      try {
        const response = await fetch('/api/trpc/health.nonexistent', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        tests.push({
          test: 'invalid-procedure',
          status: response.status,
          success: response.ok,
        })
      } catch (error) {
        tests.push({
          test: 'invalid-procedure',
          status: 0,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        })
      }

      // Test 2: Invalid echo input (too long message)
      try {
        const longMessage = 'x'.repeat(1001) // Exceeds 1000 char limit
        const input = encodeURIComponent(JSON.stringify({ message: longMessage }))
        const response = await fetch(`/api/trpc/health.echo?input=${input}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        tests.push({
          test: 'invalid-echo-input',
          status: response.status,
          success: response.ok,
        })
      } catch (error) {
        tests.push({
          test: 'invalid-echo-input',
          status: 0,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        })
      }

      // Test 3: Invalid ping delay (too high)
      try {
        const input = encodeURIComponent(JSON.stringify({ delay: 10000 })) // Exceeds 5000ms limit
        const response = await fetch(`/api/trpc/health.ping?input=${input}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        tests.push({
          test: 'invalid-ping-delay',
          status: response.status,
          success: response.ok,
        })
      } catch (error) {
        tests.push({
          test: 'invalid-ping-delay',
          status: 0,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        })
      }

      return tests
    })

    // All error tests should fail appropriately
    const invalidProcedure = errorTests.find((t) => t.test === 'invalid-procedure')
    const invalidEcho = errorTests.find((t) => t.test === 'invalid-echo-input')
    const invalidPing = errorTests.find((t) => t.test === 'invalid-ping-delay')

    expect(invalidProcedure?.success).toBe(false)
    expect(invalidEcho?.success).toBe(false)
    expect(invalidPing?.success).toBe(false)
  })

  test('concurrent requests: system stability', async ({ page }) => {
    // Test concurrent requests to verify system stability
    const concurrentResult = await page.evaluate(async () => {
      const startTime = Date.now()

      // Create mixed concurrent requests
      const requests = [
        // Health checks
        ...Array.from({ length: 5 }, () =>
          fetch('/api/trpc/health.check', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
        ),
        // Echo requests
        ...Array.from({ length: 5 }, (_, i) => {
          const input = encodeURIComponent(JSON.stringify({ message: `Concurrent test ${i}` }))
          return fetch(`/api/trpc/health.echo?input=${input}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
        }),
        // Ping requests
        ...Array.from({ length: 5 }, () => {
          const input = encodeURIComponent(JSON.stringify({ delay: 50 }))
          return fetch(`/api/trpc/health.ping?input=${input}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
        }),
      ]

      try {
        const responses = await Promise.all(requests)
        const endTime = Date.now()

        const results = responses.map((response, index) => ({
          index,
          status: response.status,
          success: response.ok,
        }))

        return {
          success: true,
          totalRequests: requests.length,
          successfulRequests: results.filter((r) => r.success).length,
          duration: endTime - startTime,
          results,
        }
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          duration: Date.now() - startTime,
        }
      }
    })

    // Verify concurrent requests handled successfully
    expect(concurrentResult.success).toBe(true)
    expect(concurrentResult.totalRequests).toBe(15)
    expect(concurrentResult.successfulRequests).toBeGreaterThan(10) // Allow for some rate limiting
    expect(concurrentResult.duration).toBeLessThan(10000) // Should complete within 10 seconds
  })
})
