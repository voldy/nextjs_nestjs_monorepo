import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { verifyToken } from '@clerk/backend'
import { BackendEnv } from '../../../../env.ts'

export interface ClerkUser {
  sub: string // User ID
  email?: string
  firstName?: string
  lastName?: string
  imageUrl?: string
  [key: string]: any
}

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<any>()

    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException('No authentication token provided')
    }

    if (!BackendEnv.CLERK_SECRET_KEY) {
      throw new UnauthorizedException('Clerk secret key not configured')
    }

    try {
      // Verify the JWT token with Clerk's official SDK
      const payload = await verifyToken(token, {
        secretKey: BackendEnv.CLERK_SECRET_KEY,
      })

      // Attach user info to request
      ;(request as any).user = {
        sub: payload.sub,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        imageUrl: payload.imageUrl,
      }

      return true
    } catch {
      throw new UnauthorizedException('Invalid authentication token')
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
