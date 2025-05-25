import { execSync } from 'child_process'
import { PrismaClient } from '../generated/prisma/index.js'

// Set test environment
process.env.NODE_ENV = 'test'

// Use test database URL if available, otherwise fallback
const testDatabaseUrl =
  process.env.TEST_DATABASE_URL || 'postgresql://postgres:password@localhost:5432/monorepo_test?schema=public'

process.env.DATABASE_URL = testDatabaseUrl

async function setupTestDatabase() {
  console.log('🔧 Setting up test database...')

  try {
    // Use db push instead of migrate for tests (faster and doesn't require migration files)
    execSync('pnpm prisma db push --force-reset --accept-data-loss', {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: testDatabaseUrl,
      },
    })

    console.log('✅ Test database schema synced successfully')

    // Optionally seed test data
    try {
      execSync('pnpm prisma db seed', {
        cwd: process.cwd(),
        stdio: 'pipe', // Use pipe to avoid cluttering test output
        env: {
          ...process.env,
          DATABASE_URL: testDatabaseUrl,
        },
      })
      console.log('✅ Test database seeded successfully')
    } catch {
      console.log('ℹ️  No seed data or seed failed (this is usually okay for tests)')
    }
  } catch (error) {
    console.error('❌ Failed to setup test database:', error)
    process.exit(1)
  }
}

// Global test setup - runs once before all tests
beforeAll(async () => {
  await setupTestDatabase()
}, 30000) // 30 second timeout for database setup

// Cleanup after all tests
afterAll(async () => {
  const prisma = new PrismaClient()
  await prisma.$disconnect()
})
