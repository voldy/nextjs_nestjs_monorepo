import { defineConfig, devices } from '@playwright/test'
import { nxE2EPreset } from '@nx/playwright/preset'
// import { workspaceRoot } from '@nx/devkit'

// Environment configuration for E2E testing
// Use different ports to avoid conflicts with development servers
const frontendURL = process.env['E2E_FRONTEND_URL'] || 'http://localhost:4201'
const backendURL = process.env['E2E_BACKEND_URL'] || 'http://localhost:3001'

/**
 * Comprehensive E2E Testing Configuration
 *
 * Tests the entire application stack:
 * - Frontend (Next.js on port 4201 for E2E)
 * - Backend API (NestJS on port 3001 for E2E)
 * - tRPC integration
 * - Database interactions
 */
export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './src' }),

  /* Global test settings */
  timeout: 30000, // 30 seconds per test
  expect: {
    timeout: 10000, // 10 seconds for assertions
  },

  /* Shared settings for all projects */
  use: {
    baseURL: frontendURL,

    /* Collect trace when retrying failed tests */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Record video on failure */
    video: 'retain-on-failure',

    /* Global test context */
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  },

  /* Test output and reporting */
  outputDir: 'test-results',
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'junit-results.xml' }],
    ['list'], // Console output
  ],

  /* Retry configuration */
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  /* Global setup and teardown */
  globalSetup: require.resolve('./src/global-setup.ts'),
  // globalTeardown: require.resolve('./src/global-teardown.ts'),

  /* Start both frontend and backend servers before tests */
  // webServer: {
  //   command: './start-servers.sh',
  //   url: frontendURL,
  //   reuseExistingServer: !process.env.CI,
  //   cwd: __dirname,
  //   timeout: 120000, // 2 minutes to start
  // },

  /* Browser projects */
  projects: [
    /* Desktop browsers - Chromium only for speed */
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },

    /* Uncomment to test on additional browsers:
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },

    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
    */

    /* API testing (headless) */
    {
      name: 'api-tests',
      use: {
        baseURL: backendURL,
        extraHTTPHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
      testMatch: '**/api/**/*.spec.ts',
    },
  ],
})
