#!/usr/bin/env tsx

/**
 * Simple test script to verify API documentation endpoints
 * Run this after starting the backend server to test Swagger setup
 */

import http from 'node:http'

const BASE_URL = 'http://localhost:3000'

interface Endpoint {
  path: string
  description: string
}

interface TestResult {
  path: string
  status: number
  isSuccess: boolean
}

const endpoints: Endpoint[] = [
  { path: '/health', description: 'Health check endpoint' },
  { path: '/api', description: 'Welcome message' },
  { path: '/api/docs', description: 'Swagger UI documentation' },
  { path: '/api/docs/swagger.json', description: 'OpenAPI JSON specification' },
]

async function testEndpoint(path: string, description: string): Promise<TestResult> {
  return new Promise((resolve) => {
    const req = http.get(`${BASE_URL}${path}`, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        const status = res.statusCode ?? 0
        const isSuccess = status >= 200 && status < 300
        console.log(`${isSuccess ? '✅' : '❌'} ${description}`)
        console.log(`   ${path} → ${status}`)
        if (!isSuccess) {
          console.log(`   Error: ${data.slice(0, 100)}...`)
        }
        resolve({ path, status, isSuccess })
      })
    })

    req.on('error', (err) => {
      console.log(`❌ ${description}`)
      console.log(`   ${path} → Error: ${err.message}`)
      resolve({ path, status: 0, isSuccess: false })
    })

    req.setTimeout(5000, () => {
      req.destroy()
      console.log(`❌ ${description}`)
      console.log(`   ${path} → Timeout`)
      resolve({ path, status: 0, isSuccess: false })
    })
  })
}

async function main(): Promise<void> {
  console.log('🧪 Testing API Documentation Endpoints...\n')

  const results: TestResult[] = []
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint.path, endpoint.description)
    results.push(result)
  }

  console.log('\n📊 Summary:')
  const successful = results.filter((r) => r.isSuccess).length
  const total = results.length

  console.log(`${successful}/${total} endpoints working correctly`)

  if (successful === total) {
    console.log('\n🎉 All API documentation endpoints are working!')
    console.log(`📚 Visit ${BASE_URL}/api/docs to view the interactive documentation`)
  } else {
    console.log('\n⚠️  Some endpoints are not working. Make sure the backend server is running.')
    process.exit(1)
  }
}

main().catch(console.error)
