import { withNx } from '@nx/next/plugins/with-nx.js'
import type { NextConfig } from 'next'

const backendHost = process.env.BACKEND_HOST || 'http://localhost'
const backendPort = process.env.BACKEND_PORT || '3000'
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
