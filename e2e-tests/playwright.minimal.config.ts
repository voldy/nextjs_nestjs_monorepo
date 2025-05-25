import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './src',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:4201',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
})
