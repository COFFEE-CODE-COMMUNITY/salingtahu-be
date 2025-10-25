import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { AccessTokenService } from "../../modules/auth/services/access-token.service"
import { Request } from "express"
import { plainToInstance } from "class-transformer"
import { CommonResponseDto } from "../dto/common-response.dto"
import { Reflector } from "@nestjs/core"

export const Authorized = Reflector.createDecorator()

@Injectable()
export class BearerTokenGuard implements CanActivate {
  public constructor(
    private readonly accessToken: AccessTokenService,
    private readonly reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isRequiredAuthorized = this.reflector.get(Authorized, context.getHandler())

    if (!isRequiredAuthorized) return true

    const request = context.switchToHttp().getRequest<Request>()
    const authorizationHeader = request.headers.authorization

    try {
      if (!authorizationHeader) throw new BearerTokenException()

      const [scheme, token] = authorizationHeader.split(" ")

      if (scheme !== "Bearer" || !token) throw new BearerTokenException()
      const userId = await this.accessToken.verify(token)

      if (!userId) throw new BearerTokenException()

      request.userId = userId

      return true
    } catch (error) {
      if (error instanceof BearerTokenException) {
        throw new UnauthorizedException(plainToInstance(CommonResponseDto, { message: error.message }))
      } else {
        throw error
      }
    }
  }
}

class BearerTokenException extends Error {
  public constructor() {
    super("Unauthorized.")
    this.name = "BearerTokenException"
  }
}
