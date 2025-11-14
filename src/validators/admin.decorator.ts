import { SetMetadata, ExecutionContext, CustomDecorator } from "@nestjs/common"
import { Injectable, CanActivate, UnauthorizedException } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { ConfigService } from "@nestjs/config"

// Metadata key untuk decorator
const IS_ADMIN_KEY = "isAdmin"

// Decorator @Admin()
export const Admin = (): CustomDecorator<string> => SetMetadata(IS_ADMIN_KEY, true)

// Guard untuk validasi admin
@Injectable()
export class AdminGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService
  ) {}

  public canActivate(context: ExecutionContext): boolean {
    const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [context.getHandler(), context.getClass()])

    if (!isAdmin) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const apiKeyFromHeader = request.headers["x-admin-api-key"]
    const adminApiKey = this.config.getOrThrow<string>("ADMIN_API_KEY")

    if (!apiKeyFromHeader) {
      throw new UnauthorizedException("Admin API key is missing")
    }

    if (apiKeyFromHeader !== adminApiKey) {
      throw new UnauthorizedException("Invalid admin API key")
    }

    return true
  }
}
