import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { ClerkUser } from './clerk-auth.guard.ts'

export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext): ClerkUser => {
  const request = ctx.switchToHttp().getRequest()
  return request.user
})
