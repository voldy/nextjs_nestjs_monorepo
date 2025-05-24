import { All, Controller, Req, Res } from '@nestjs/common'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter, type TrpcContext } from '@shared'

@Controller('trpc')
export class TrpcController {
  @All('*')
  async handler(@Req() req: any, @Res() res: any): Promise<void> {
    // Create a proper Request object for the fetch handler
    const url = new URL(String(req.url), `http://${req.headers.host || 'localhost:3000'}`)

    const fetchRequest = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    })

    const fetchResponse = await fetchRequestHandler({
      endpoint: '/api/trpc',
      req: fetchRequest,
      router: appRouter,
      createContext: (): TrpcContext => ({ req, res }),
    })

    // Convert fetch Response to Fastify response
    res.code(fetchResponse.status)

    for (const [key, value] of fetchResponse.headers.entries()) {
      res.header(key, value)
    }

    if (fetchResponse.body) {
      const body = await fetchResponse.text()
      res.send(body)
    } else {
      res.send()
    }
  }
}
