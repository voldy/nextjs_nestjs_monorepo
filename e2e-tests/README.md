# E2E Testing Infrastructure

This directory contains comprehensive end-to-end tests for the entire application stack using Playwright.

## Overview

The E2E testing infrastructure tests:

- **Frontend** (Next.js on port 4201 for E2E)
- **Backend API** (NestJS on port 3001 for E2E)
- **tRPC integration** between frontend and backend
- **Database interactions** and data persistence
- **Cross-browser compatibility**
- **Mobile responsiveness**
- **API resilience** (rate limiting, timeouts, error handling)

**Port Configuration**: E2E tests use different ports (backend: 3001, frontend: 4201) to avoid conflicts with development servers running on the default ports (3000, 4200).

## Test Structure

```
e2e-tests/
├── src/
│   ├── frontend/          # Frontend UI tests
│   │   └── app.spec.ts    # Main application tests
│   ├── api/               # Backend API tests
│   │   └── health.spec.ts # Health and resilience tests
│   ├── integration/       # Full-stack integration tests
│   ├── utils/             # Test utilities and helpers
│   │   └── test-helpers.ts
│   ├── global-setup.ts    # Global test setup
│   └── global-teardown.ts # Global test cleanup
├── playwright.config.ts   # Playwright configuration
├── start-servers.sh       # Server startup script
└── README.md              # This file
```

## Running Tests

### Prerequisites

**⚠️ Important: Start servers manually before running tests**

1. **Start the backend server** (in terminal 1):

   ```bash
   cd backend
   PORT=3001 pnpm start:dev
   ```

2. **Start the frontend server** (in terminal 2):

   ```bash
   cd frontend
   BACKEND_PORT=3001 pnpm nx serve --configuration=e2e
   ```

3. **Verify servers are running**:
   - Backend: http://localhost:3001/health
   - Frontend: http://localhost:4201

### Basic Commands

```bash
# Run all E2E tests (after starting servers)
cd e2e-tests
npx playwright test

# Run with UI mode (interactive)
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Run specific test file
npx playwright test src/api/health.spec.ts

# Run specific project
npx playwright test --project=chromium
npx playwright test --project=api-tests
```

### Alternative: Startup Script

```bash
# Start both servers with one command
cd e2e-tests
./start-servers.sh

# In another terminal, run tests
cd e2e-tests
npx playwright test
```

### Nx Commands (Legacy)

```bash
# Run E2E tests
nx e2e e2e-tests

# Run specific test file
nx e2e e2e-tests --grep "Frontend Application"

# Run tests for specific browser
nx e2e e2e-tests --project=chromium

# Run API tests only
nx e2e e2e-tests --grep "Backend API"
```

## Browser Coverage

By default, tests run on **Chromium only** for speed and reliability.

### Default Configuration

- **Desktop**: Chromium (Chrome)
- **API**: Headless tests for backend endpoints

### Additional Browser Testing

To enable testing on additional browsers, uncomment the desired projects in `playwright.config.ts`:

```typescript
// Uncomment in playwright.config.ts to enable:
{
  name: 'firefox',
  use: { ...devices['Desktop Firefox'] },
},
{
  name: 'webkit',
  use: { ...devices['Desktop Safari'] },
},
{
  name: 'mobile-chrome',
  use: { ...devices['Pixel 5'] },
},
{
  name: 'mobile-safari',
  use: { ...devices['iPhone 12'] },
},
```

### Running Specific Browsers

```bash
# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run on all browsers (if enabled)
npx playwright test
```

**Note**: Additional browsers increase test time significantly. Enable them only when needed for cross-browser compatibility testing.

## Test Categories

### 1. Frontend Tests (`frontend/`)

- Page loading and rendering
- Component interactions
- tRPC client functionality
- Responsive design
- Navigation flows

### 2. API Tests (`api/`)

- Health check endpoints
- tRPC server functionality
- Rate limiting behavior
- CORS configuration
- Error handling

### 3. Integration Tests (`integration/`)

- **Health System Integration** (`health-integration.spec.ts`)
  - **Ping-pong tests**: Complete round-trip Frontend → tRPC → Backend → Response
  - **Health check verification**: System status, memory, uptime monitoring
  - **Echo tests**: Data integrity through full stack
  - **Rate limiting**: Protection mechanism verification
  - **Error handling**: Invalid requests and proper error responses
  - **Concurrent requests**: System stability under load

_Note: Additional integration tests for user management and other features will be added as those tRPC procedures are implemented._

## Test Utilities

### TestHelpers Class

```typescript
const helpers = new TestHelpers(page)

// Wait for page to load
await helpers.waitForPageLoad()

// Take screenshots
await helpers.takeScreenshot('homepage')

// Check API responses
await helpers.checkApiResponse('/api/health')

// Wait for tRPC calls
await helpers.waitForTrpcCall('health.check')
```

### DatabaseHelpers Class

```typescript
const dbHelpers = new DatabaseHelpers()

// Reset database
await dbHelpers.resetDatabase()

// Seed test data
await dbHelpers.seedTestData(testData)
```

### AuthHelpers Class

```typescript
const authHelpers = new AuthHelpers(page)

// Login with test credentials
await authHelpers.login('test@example.com', 'password')

// Logout
await authHelpers.logout()
```

## Configuration

### Environment Variables

- `E2E_FRONTEND_URL`: Frontend server URL for E2E tests (default: http://localhost:4201)
- `E2E_BACKEND_URL`: Backend server URL for E2E tests (default: http://localhost:3001)

### Test Settings

- **Timeout**: 30 seconds per test
- **Retries**: 2 retries in CI, 0 locally
- **Workers**: 1 in CI, unlimited locally
- **Screenshots**: On failure only
- **Videos**: Retained on failure

## Reporting

Test results are generated in multiple formats:

- **HTML Report**: `playwright-report/index.html`
- **JSON Results**: `test-results.json`
- **JUnit XML**: `junit-results.xml`
- **Console Output**: Real-time during test runs

## Best Practices

### Writing Tests

1. **Use data-testid attributes** for reliable element selection
2. **Wait for network idle** before assertions
3. **Take screenshots** for visual regression testing
4. **Use page object models** for complex workflows
5. **Mock external services** when appropriate

### Test Organization

1. **Group related tests** in describe blocks
2. **Use descriptive test names** that explain the behavior
3. **Keep tests independent** and isolated
4. **Clean up test data** after each test
5. **Use factories** for test data generation

### Performance

1. **Reuse browser contexts** when possible
2. **Parallelize tests** that don't conflict
3. **Use headless mode** for faster execution
4. **Skip unnecessary waits** with proper selectors
5. **Optimize test data setup** and teardown

## Debugging

### Local Debugging

```bash
# Run in debug mode
npx playwright test --debug

# Run specific test
npx playwright test --grep "should load homepage" --debug

# Open trace viewer
npx playwright show-trace trace.zip
```

### Common Issues

1. **Server not starting**: Check port availability
2. **Element not found**: Verify data-testid attributes
3. **Timeout errors**: Increase timeout or improve selectors
4. **Flaky tests**: Add proper waits and assertions
5. **Database conflicts**: Ensure proper test isolation

## Troubleshooting

### Common Commands

```bash
# Clear Playwright cache
npx playwright install

# Update browsers
npx playwright install --with-deps

# Check configuration
npx playwright test --list

# Generate test code
npx playwright codegen localhost:4201
```

### Log Analysis

- Check browser console logs in test output
- Review network requests in trace files
- Analyze timing issues with timeline view
- Use Playwright Inspector for step-by-step debugging

This E2E testing infrastructure provides comprehensive coverage of the entire application stack, ensuring reliability and quality across all user interactions and system integrations.
