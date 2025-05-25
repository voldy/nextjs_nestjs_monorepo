/* eslint-disable no-undef */
import { useState, useCallback, useRef } from 'react'

interface UseApiOptions {
  retry?: number
  retryDelay?: number
  cache?: boolean
  cacheTime?: number
}

interface ApiCall<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  execute: () => Promise<void>
  refetch: () => Promise<void>
}

const cache = new Map<string, { data: unknown; timestamp: number }>()

export function useApi<T>(endpoint: string, options: UseApiOptions = {}): ApiCall<T> {
  const {
    retry = 2,
    retryDelay = 1000,
    cache: useCache = true,
    cacheTime = 30000, // 30 seconds
  } = options

  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchData = useCallback(
    async (retryCount = 0): Promise<void> => {
      // Check cache first
      if (useCache) {
        const cached = cache.get(endpoint)
        if (cached && Date.now() - cached.timestamp < cacheTime) {
          setData(cached.data as T)
          return
        }
      }

      // Abort previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(endpoint, {
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const responseData = await response.json()
        const result: T = responseData.result?.data || responseData

        // Cache the result
        if (useCache) {
          cache.set(endpoint, { data: result, timestamp: Date.now() })
        }

        setData(result)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return // Request was aborted
        }

        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data'

        // Retry logic
        if (retryCount < retry) {
          setTimeout(
            () => {
              void fetchData(retryCount + 1)
            },
            retryDelay * (retryCount + 1),
          ) // Exponential backoff
          return
        }

        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [endpoint, retry, retryDelay, useCache, cacheTime],
  )

  const execute = useCallback(() => fetchData(), [fetchData])
  const refetch = useCallback(() => {
    // Clear cache for this endpoint
    cache.delete(endpoint)
    return fetchData()
  }, [endpoint, fetchData])

  return {
    data,
    isLoading,
    error,
    execute,
    refetch,
  }
}
