import { test, expect } from '@playwright/test'
import { TestHelpers } from '../utils/test-helpers'

test.describe('Frontend Application', () => {
  let helpers: TestHelpers

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page)
    await page.goto('/')
  })

  test('should load the homepage', async ({ page }) => {
    await helpers.waitForPageLoad()

    // Check page title
    await expect(page).toHaveTitle(/Next.js/)

    // Check main content is visible
    await expect(page.locator('main')).toBeVisible()

    // Take screenshot for visual regression
    await helpers.takeScreenshot('homepage')
  })

  test('should display tRPC health status', async ({ page }) => {
    await helpers.waitForPageLoad()

    // Look for health check button or status
    const healthButton = page.locator('[data-testid="health-check"]')
    if (await healthButton.isVisible()) {
      await healthButton.click()

      // Wait for tRPC call to complete
      await helpers.waitForTrpcCall('health.check')

      // Check for success indicator
      await expect(page.locator('[data-testid="health-status"]')).toContainText('ok')
    }
  })

  test('should handle tRPC ping functionality', async ({ page }) => {
    await helpers.waitForPageLoad()

    // Look for ping button
    const pingButton = page.locator('[data-testid="ping-button"]')
    if (await pingButton.isVisible()) {
      await pingButton.click()

      // Wait for ping response
      await helpers.waitForTrpcCall('health.ping')

      // Check for pong response
      await expect(page.locator('[data-testid="ping-result"]')).toContainText('pong')
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await helpers.waitForPageLoad()

    // Check mobile layout
    await expect(page.locator('main')).toBeVisible()

    // Take mobile screenshot
    await helpers.takeScreenshot('homepage-mobile')
  })

  test('should handle navigation', async ({ page }) => {
    await helpers.waitForPageLoad()

    // Test navigation if nav elements exist
    const navLinks = page.locator('nav a')
    const linkCount = await navLinks.count()

    if (linkCount > 0) {
      // Click first navigation link
      await navLinks.first().click()
      await helpers.waitForPageLoad()

      // Verify navigation worked
      await expect(page.locator('main')).toBeVisible()
    }
  })
})
