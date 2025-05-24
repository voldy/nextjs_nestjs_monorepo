'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useApi } from '@/hooks/use-api'

// Type for the actual REST /health endpoint response
type HealthCheckResponse = {
  status: string
  timestamp: string
  uptime: number
  memory: {
    used: number
    total: number
  }
}

export function HealthStatus() {
  const {
    data: health,
    isLoading,
    error,
    execute,
    refetch,
  } = useApi<HealthCheckResponse>('/health', {
    retry: 3,
    retryDelay: 1000,
    cache: true,
    cacheTime: 30000, // 30 seconds
  })

  useEffect(() => {
    execute()
  }, [execute])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ${health?.status === 'ok' ? 'bg-green-500' : 'bg-red-500'}`} />
          Backend Health
        </CardTitle>
        <CardDescription>Real-time server status with caching & retries</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="border-muted-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
            <p className="text-muted-foreground text-sm">Loading...</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            ❌ {error}
          </div>
        )}

        {health && (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium text-green-600">{health.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Uptime:</span>
              <span className="font-medium">
                {Math.floor(health.uptime / 60)}m {health.uptime % 60}s
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Memory:</span>
              <span className="font-medium">
                {health.memory.used}MB / {health.memory.total}MB
              </span>
            </div>
            <div className="text-muted-foreground text-xs">
              Last checked: {new Date(health.timestamp).toLocaleTimeString()}
            </div>
          </div>
        )}

        <Button variant="outline" size="sm" onClick={refetch} disabled={isLoading} className="w-full">
          {isLoading ? 'Checking...' : 'Refresh'}
        </Button>
      </CardContent>
    </Card>
  )
}
