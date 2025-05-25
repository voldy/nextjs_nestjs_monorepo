'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc'

export function PingButton() {
  const [delay, setDelay] = useState(500)

  // Use tRPC React Query hook for queries
  const {
    data: pingResult,
    isLoading,
    error,
    refetch,
  } = trpc.health.ping.useQuery(
    { delay },
    {
      enabled: false, // Don't auto-fetch, only on manual trigger
      retry: false, // Don't auto-retry for this demo
    },
  )

  const handlePing = () => {
    void refetch()
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">🏓 Ping Test</CardTitle>
        <CardDescription>Test server response time using tRPC</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Delay selector - same pattern as existing component */}
        <div className="flex gap-2">
          <span className="text-muted-foreground self-center text-sm">Delay:</span>
          {[100, 500, 1000, 2000].map((delayOption) => (
            <Button
              key={delayOption}
              variant={delay === delayOption ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDelay(delayOption)}
              disabled={isLoading}
            >
              {delayOption}ms
            </Button>
          ))}
        </div>

        <Button onClick={handlePing} disabled={isLoading} className="w-full">
          {isLoading ? 'Pinging...' : '🏓 Ping Server'}
        </Button>

        {pingResult && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
            <p className="font-semibold">{pingResult.message}</p>
            <p className="text-xs opacity-75">
              Delay: {pingResult.delay}ms • {new Date(pingResult.timestamp).toLocaleTimeString()}
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
            ❌ {error.message}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
