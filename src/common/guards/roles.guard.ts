import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { UserRole } from "../../modules/user/enums/user-role.enum"
import { Request } from "express"
import { UserRepository } from "../../modules/user/repositories/user.repository"
import { plainToInstance } from "class-transformer"
import { CommonResponseDto } from "../dto/common-response.dto"

export const Roles = Reflector.createDecorator<UserRole[]>()

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly UNAUTHORIZED_RESPONSE = plainToInstance(CommonResponseDto, {
    message: "Unauthorized.",
  })

  public constructor(
    private readonly reflector: Reflector,
    private readonly userRepository: UserRepository,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler())
    const request = context.switchToHttp().getRequest<Request>()
    const userId = request.userId

    if (!userId) {
      throw new UnauthorizedException(this.UNAUTHORIZED_RESPONSE)
    }

    const userRoles = await this.userRepository.findRolesById(userId)

    if (roles.some(role => userRoles.includes(role))) return true

    throw new UnauthorizedException(plainToInstance(CommonResponseDto, this.UNAUTHORIZED_RESPONSE))
  }
}
