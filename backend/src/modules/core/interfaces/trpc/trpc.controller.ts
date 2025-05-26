import { Controller, All, Req, Res } from '@nestjs/common'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@shared'
import { verifyToken } from '@clerk/backend'
import { BackendEnv } from '../../../../env.ts'

@Controller('trpc')
export class TrpcController {
  @All('*')
  async handleTrpc(@Req() req: any, @Res() res: any) {
    try {
      // Add request timeout
      const timeoutMs = 30000 // 30 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timeout'))
        }, timeoutMs)
      })

      // Convert NestJS/Fastify request to fetch-compatible request
      const url = new URL(req.url as string, `http://${req.headers.host || 'localhost:3000'}`)

      // Get request body for POST/PUT requests
      let body: string | undefined
      if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
        body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
      }

      const fetchRequest = new Request(url, {
        method: req.method,
        headers: req.headers,
        body,
      })

      // Extract user from JWT token if present
      const extractUser = async () => {
        try {
          const authHeader = req.headers.authorization
          if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return undefined
          }

          const token = authHeader.split(' ')[1]
          if (!token || !BackendEnv.CLERK_SECRET_KEY) {
            return undefined
          }

          // Use Clerk's official verification method
          const payload = await verifyToken(token, {
            secretKey: BackendEnv.CLERK_SECRET_KEY,
          })

          return {
            id: payload.sub,
            email: payload.email as string | undefined,
          }
        } catch {
          // Silent fail for invalid tokens
          return undefined
        }
      }

      // Handle the request with tRPC (with timeout)
      const response = (await Promise.race([
        fetchRequestHandler({
          endpoint: '/api/trpc',
          req: fetchRequest,
          router: appRouter,
          createContext: async () => ({
            // Add your context here (user, database, etc.)
            req,
            res,
            user: await extractUser(),
          }),
        }),
        timeoutPromise,
      ])) as Response

      // Convert fetch response back to Fastify response
      const responseBody = await response.text()

      // Set headers using Fastify's API
      response.headers.forEach((value, key) => {
        res.header(key, value)
      })

      // Set status and send response using Fastify's API
      return res.status(response.status).send(responseBody)
    } catch (error) {
      // Handle timeout and other errors
      if (error instanceof Error && error.message === 'Request timeout') {
        return res.status(408).send({
          error: 'Request Timeout',
          message: 'The request took too long to process',
        })
      }

      // Handle other errors
      return res.status(500).send({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      })
    }
  }
}
