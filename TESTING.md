# Testing Infrastructure

This document outlines the comprehensive testing strategy and infrastructure for the monorepo.

## Overview

The testing infrastructure provides multiple layers of testing:

1. **Unit Tests** - Test individual components and functions in isolation
2. **Integration Tests** - Test interactions between components and external services
3. **End-to-End Tests** - Test complete user workflows across the entire stack
4. **API Tests** - Test backend endpoints and tRPC procedures
5. **Coverage Reporting** - Track test coverage and quality metrics

## Test Structure

```
monorepo/
├── backend/
│   ├── src/**/*.spec.ts           # Unit tests
│   ├── src/**/*.integration.spec.ts # Integration tests
│   ├── test/                      # E2E test setup
│   └── jest.config.cjs            # Jest configuration
├── frontend/
│   ├── src/**/*.test.tsx          # Component tests
│   ├── src/**/__tests__/          # Test directories
│   └── jest.config.js             # Jest configuration
├── e2e-tests/
│   ├── src/frontend/              # Frontend E2E tests
│   ├── src/api/                   # API E2E tests
│   ├── src/integration/           # Full-stack integration tests
│   ├── src/utils/                 # Test utilities
│   └── playwright.config.ts      # Playwright configuration
├── packages/shared/
│   ├── src/**/*.test.ts           # Shared utility tests
│   └── jest.config.ts             # Jest configuration
└── jest.config.ts                 # Root Jest configuration
```

## Running Tests

### All Tests

```bash
# Run all unit tests
pnpm test

# Run all tests including E2E
pnpm test:all

# Run tests in watch mode
pnpm test:watch
```

### Unit Tests by Project

```bash
# Backend unit tests
pnpm test:backend

# Frontend unit tests
pnpm test:frontend

# Shared package tests
pnpm test:shared
```

### Coverage Reports

```bash
# Generate coverage for all projects
pnpm test:coverage

# Backend coverage only
pnpm test:coverage:backend

# Frontend coverage only
pnpm test:coverage:frontend
```

### End-to-End Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Run E2E tests in headed mode
pnpm test:e2e:headed

# Debug E2E tests
pnpm test:e2e:debug
```

## Backend Testing

### Technologies

- **Jest** - Test runner and assertion library
- **Supertest** - HTTP testing
- **Prisma** - Database testing utilities
- **NestJS Testing** - Dependency injection and module testing

### Test Types

#### Unit Tests (`*.spec.ts`)

- Domain entities and business logic
- Application services
- Controllers (with mocked dependencies)
- Utilities and helpers

#### Integration Tests (`*.integration.spec.ts`)

- Repository implementations against real database
- External service integrations
- Database operations and transactions

### Test Factories

Located in `backend/src/modules/core/test-utils/factories/`:

- **UserEntityFactory** - Domain entity creation
- **CreateUserDtoFactory** - DTO creation
- **DatabaseUserFactory** - Database record creation
- **TestScenariosFactory** - Complex test scenarios

### Coverage Configuration

- **Statements**: 55% minimum
- **Branches**: 40% minimum
- **Functions**: 45% minimum
- **Lines**: 55% minimum

Reports generated in `backend/coverage/`:

- HTML report: `lcov-report/index.html`
- LCOV format for CI integration
- JSON format for programmatic access

## Frontend Testing

### Technologies

- **Jest** - Test runner
- **React Testing Library** - Component testing
- **jsdom** - DOM simulation
- **MSW** (planned) - API mocking

### Test Types

- Component rendering and behavior
- Hook functionality
- User interactions
- tRPC client integration
- Responsive design

### Coverage Configuration

- **Statements**: 75% minimum
- **Branches**: 75% minimum
- **Functions**: 75% minimum
- **Lines**: 75% minimum

## E2E Testing

### Technologies

- **Playwright** - Browser automation
- **Multiple browsers** - Chrome, Firefox, Safari, Mobile

### Test Categories

#### Frontend Tests (`e2e-tests/src/frontend/`)

- Page loading and rendering
- User interactions and workflows
- Responsive design validation
- Cross-browser compatibility

#### API Tests (`e2e-tests/src/api/`)

- REST endpoint functionality
- tRPC procedure testing
- Rate limiting behavior
- CORS configuration
- Error handling

#### Integration Tests (`e2e-tests/src/integration/`)

- Full user workflows
- Database persistence
- Authentication flows
- Cross-component interactions

### Browser Matrix

- **Desktop**: Chrome, Firefox, Safari (1280x720)
- **Mobile**: Chrome (Pixel 5), Safari (iPhone 12)
- **API**: Headless testing for backend endpoints

### Test Utilities

- **TestHelpers** - Page interactions and assertions
- **DatabaseHelpers** - Database setup and cleanup
- **AuthHelpers** - Authentication workflows

## Test Data Management

### Factories Pattern

Each domain module has its own factory directory:

```
backend/src/modules/{domain}/test-utils/factories/
├── {entity}.factory.ts        # Domain entities
├── {dto}.factory.ts           # Data transfer objects
├── database-{entity}.factory.ts # Database records
├── test-scenarios.factory.ts  # Complex scenarios
└── index.ts                   # Exports and reset
```

### Database Testing

- **Test isolation** - Each test runs in clean state
- **Transactions** - Automatic rollback for unit tests
- **Seeding** - Consistent test data setup
- **Cleanup** - Automatic cleanup between tests

## CI/CD Integration

### GitHub Actions

```yaml
name: Tests
on: [push, pull_request]
jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: pnpm install
      - name: Run unit tests
        run: pnpm test:coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
      - name: Install dependencies
        run: pnpm install
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run E2E tests
        run: pnpm test:e2e
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: e2e-tests/playwright-report/
```

### Coverage Reporting

- **Codecov** integration for coverage tracking
- **HTML reports** for local development
- **LCOV format** for CI/CD pipelines
- **Threshold enforcement** to maintain quality

## Best Practices

### Writing Tests

1. **Descriptive names** - Test names should explain the behavior
2. **Arrange-Act-Assert** - Clear test structure
3. **Test isolation** - Tests should not depend on each other
4. **Mock external dependencies** - Use mocks for external services
5. **Test edge cases** - Include error conditions and boundary cases

### Test Organization

1. **Co-locate tests** - Keep tests near the code they test
2. **Use factories** - Create reusable test data generators
3. **Group related tests** - Use describe blocks for organization
4. **Clean up resources** - Ensure proper cleanup in afterEach/afterAll
5. **Document complex tests** - Add comments for complex test logic

### Performance

1. **Parallel execution** - Run tests in parallel when possible
2. **Selective testing** - Run only affected tests during development
3. **Efficient setup** - Minimize test setup and teardown time
4. **Resource management** - Properly manage database connections and browser instances

## Debugging Tests

### Unit Tests

```bash
# Run specific test file
pnpm test backend/src/path/to/test.spec.ts

# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Run with verbose output
pnpm test --verbose
```

### E2E Tests

```bash
# Run in headed mode (see browser)
pnpm test:e2e:headed

# Run in debug mode (step through)
pnpm test:e2e:debug

# Run specific test
npx playwright test --grep "test name"

# Generate test code
npx playwright codegen localhost:4200
```

### Common Issues

1. **Flaky tests** - Add proper waits and assertions
2. **Database conflicts** - Ensure test isolation
3. **Timeout errors** - Increase timeouts for slow operations
4. **Mock issues** - Verify mock implementations match real APIs
5. **Environment differences** - Use consistent test environments

## Monitoring and Metrics

### Coverage Tracking

- **Line coverage** - Percentage of code lines executed
- **Branch coverage** - Percentage of code branches taken
- **Function coverage** - Percentage of functions called
- **Statement coverage** - Percentage of statements executed

### Quality Metrics

- **Test execution time** - Monitor for performance regressions
- **Test reliability** - Track flaky test occurrences
- **Coverage trends** - Monitor coverage changes over time
- **Test count** - Track test growth with codebase

### Reporting

- **HTML reports** - Interactive coverage exploration
- **CI integration** - Automated coverage reporting
- **Trend analysis** - Coverage and quality trends over time
- **Team dashboards** - Visibility into testing metrics

This comprehensive testing infrastructure ensures high code quality, reliability, and maintainability across the entire monorepo.
