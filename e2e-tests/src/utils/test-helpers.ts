import { Page, expect } from '@playwright/test'

/**
 * Test utilities for E2E tests
 */

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for the page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Take a screenshot with a descriptive name
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `e2e-tests/screenshots/${name}.png`,
      fullPage: true,
    })
  }

  /**
   * Check if an element is visible and enabled
   */
  async isElementReady(selector: string) {
    const element = this.page.locator(selector)
    await expect(element).toBeVisible()
    await expect(element).toBeEnabled()
    return element
  }

  /**
   * Fill form field with validation
   */
  async fillField(selector: string, value: string) {
    const field = await this.isElementReady(selector)
    await field.fill(value)
    await expect(field).toHaveValue(value)
  }

  /**
   * Click button and wait for response
   */
  async clickAndWait(selector: string, waitForSelector?: string) {
    const button = await this.isElementReady(selector)
    await button.click()

    if (waitForSelector) {
      await this.page.waitForSelector(waitForSelector)
    }
  }

  /**
   * Check API response
   */
  async checkApiResponse(url: string, expectedStatus = 200) {
    const response = await this.page.request.get(url)
    expect(response.status()).toBe(expectedStatus)
    return response
  }

  /**
   * Wait for tRPC call to complete
   */
  async waitForTrpcCall(procedure: string) {
    await this.page.waitForResponse(
      (response) => response.url().includes('/api/trpc') && response.url().includes(procedure),
    )
  }
}

/**
 * Database helpers for testing
 */
export class DatabaseHelpers {
  private baseUrl = 'http://localhost:3000'

  /**
   * Reset database to clean state
   */
  async resetDatabase() {
    try {
      const response = await globalThis.fetch(`${this.baseUrl}/api/test/reset-db`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      return response.ok
    } catch {
      return false
    }
  }

  /**
   * Seed test data
   */
  async seedTestData(data: any) {
    try {
      const response = await globalThis.fetch(`${this.baseUrl}/api/test/seed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return response.ok
    } catch {
      return false
    }
  }
}

/**
 * Authentication helpers
 */
export class AuthHelpers {
  constructor(private page: Page) {}

  /**
   * Login with test credentials
   */
  async login(email = 'test@example.com', password = 'password') {
    // Implement login flow based on your authentication system
    await this.page.goto('/login')
    await this.page.fill('[data-testid="email"]', email)
    await this.page.fill('[data-testid="password"]', password)
    await this.page.click('[data-testid="login-button"]')

    // Wait for successful login
    await this.page.waitForURL('/dashboard')
  }

  /**
   * Logout
   */
  async logout() {
    await this.page.click('[data-testid="logout-button"]')
    await this.page.waitForURL('/login')
  }
}
