import { FullConfig } from '@playwright/test'

/**
 * Global setup runs once before all tests
 */
async function globalSetup(_config: FullConfig) {
  // Simple setup - just wait for servers to be ready
  // Use E2E ports (3001 for backend, 4201 for frontend)
  await waitForServer('http://localhost:3001/health', 'Backend')
  await waitForServer('http://localhost:4201', 'Frontend')
}

async function waitForServer(url: string, name: string, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await globalThis.fetch(url)
      if (response.ok) {
        return
      }
    } catch {
      // Server not ready yet
    }

    await new Promise((resolve) => globalThis.setTimeout(resolve, 2000))
  }

  throw new Error(`${name} server failed to start`)
}

export default globalSetup
