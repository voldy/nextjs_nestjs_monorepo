'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { useState, type ReactNode } from 'react'
import superjson from 'superjson'
import { trpc } from '../../lib/trpc'

export function TrpcProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            gcTime: 60 * 1000,
            // Resilience features
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            // Network error handling
            networkMode: 'offlineFirst',
          },
          mutations: {
            retry: 1,
            retryDelay: 1000,
            networkMode: 'offlineFirst',
          },
        },
      }),
  )

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        // Logging in development
        loggerLink({
          enabled: (opts) =>
            (typeof window !== 'undefined' && window.location.hostname === 'localhost') ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),

        // HTTP batching with timeout
        httpBatchLink({
          url: '/api/trpc',
          transformer: superjson,
          // Add timeout and error handling
          fetch: (url, options) => {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

            return fetch(url, {
              ...options,
              signal: controller.signal,
            }).finally(() => {
              clearTimeout(timeoutId)
            })
          },
        }),
      ],
    }),
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
