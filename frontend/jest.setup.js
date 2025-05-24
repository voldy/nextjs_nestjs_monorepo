import '@testing-library/jest-dom'

// Set up test environment variables for frontend testing
process.env.NODE_ENV = 'test'
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_FEATURE_TRPC = 'true'
process.env.NEXT_PUBLIC_DEBUG = 'false'

console.log('Jest setup complete. Frontend test environment configured.')
