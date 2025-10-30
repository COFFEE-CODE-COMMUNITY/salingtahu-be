import { createParamDecorator, ExecutionContext } from "@nestjs/common"

export const Cookie = createParamDecorator((cookieName: string, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest()
  return req.cookies?.[cookieName]
})
