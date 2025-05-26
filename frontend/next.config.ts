import { withNx } from '@nx/next/plugins/with-nx.js'
import type { NextConfig } from 'next'

const backendHost = process.env.BACKEND_HOST || 'http://localhost'
// Use port 3001 for e2e testing (when frontend runs on 4201), otherwise default to 3000
const isE2E = process.env.PORT === '4201' || process.env.NODE_ENV === 'test'
const backendPort = process.env.BACKEND_PORT || (isE2E ? '3001' : '3000')
const backendUrl = `${backendHost}:${backendPort}`

const nextConfig: NextConfig = {
  nx: {
    svgr: false,
  },
  transpilePackages: ['@monorepo/shared'],
  async rewrites() {
    return [
      // Health check (direct to backend, no /api prefix)
      {
        source: '/health',
        destination: `${backendUrl}/health`,
      },
      // tRPC API calls
      {
        source: '/api/trpc/:path*',
        destination: `${backendUrl}/api/trpc/:path*`,
      },
    ]
  },
}

export default withNx(nextConfig)
