'use client'

import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc'
import { useState } from 'react'

export function AuthStatus() {
  const { isSignedIn, user, isLoaded } = useUser()
  const [authTestResult, setAuthTestResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Use tRPC query with manual refetch for testing
  const authQuery = trpc.auth.me.useQuery(undefined, {
    enabled: false, // Don't auto-fetch
  })

  const testAuthEndpoint = async () => {
    if (!isSignedIn) {
      setAuthTestResult('❌ Not signed in')
      return
    }

    setIsLoading(true)
    setAuthTestResult(null)

    try {
      const result = await authQuery.refetch()
      if (result.data) {
        setAuthTestResult(`✅ Success: ${result.data.message}`)
      } else {
        setAuthTestResult('❌ No data returned')
      }
    } catch (error: any) {
      setAuthTestResult(`❌ Error: ${error.message || 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoaded) {
    return <div className="animate-pulse rounded bg-gray-200 p-4">Loading auth status...</div>
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-lg font-semibold">Authentication Status</h3>

      <div className="space-y-2 text-sm">
        <p>
          <strong>Signed In:</strong> {isSignedIn ? '✅ Yes' : '❌ No'}
        </p>
        {isSignedIn && user && (
          <>
            <p>
              <strong>User ID:</strong> {user.id}
            </p>
            <p>
              <strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}
            </p>
          </>
        )}
      </div>

      <div className="space-y-2">
        <Button onClick={testAuthEndpoint} disabled={isLoading || !isSignedIn} variant="outline" size="sm">
          {isLoading ? 'Testing...' : 'Test Auth Endpoint'}
        </Button>

        {authTestResult && (
          <p className="rounded bg-gray-100 p-2 font-mono text-sm dark:bg-gray-800">{authTestResult}</p>
        )}
      </div>
    </div>
  )
}
