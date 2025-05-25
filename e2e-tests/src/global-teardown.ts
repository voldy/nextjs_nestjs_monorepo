import { FullConfig } from '@playwright/test'

/**
 * Global teardown runs once after all tests
 */
async function globalTeardown(_config: FullConfig) {
  // Cleanup test artifacts
  // This could include:
  // - Cleaning up test database
  // - Removing temporary files
  // - Logging test completion
}

export default globalTeardown
