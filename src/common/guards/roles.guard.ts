import { Reflector } from "@nestjs/core"
import { Request } from "express"
import { UserRole } from "../../modules/user/enums/user-role.enum"
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { UserRepository } from "../../modules/user/repositories/user.repository"
import { plainToInstance } from "class-transformer"
import { CommonResponseDto } from "../dto/common-response.dto"

const Roles = Reflector.createDecorator<UserRole[] | undefined>()

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly UNAUTHORIZED_RESPONSE = plainToInstance(CommonResponseDto, {
    message: "Unauthorized.",
  })

  public constructor(
    private readonly userRepository: UserRepository,
    private readonly reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean | never> {
    const roles = this.reflector.get(Roles, context.getHandler())

    if (!roles) return true

    const request = context.switchToHttp().getRequest<Request>()
    const userId = request.userId

    if (!userId) {
      throw new UnauthorizedException(
        plainToInstance(CommonResponseDto, {
          message: "Unauthorized.",
        }),
      )
    }

    const userRoles = await this.userRepository.findRolesById(userId)

    if (roles.some(role => userRoles.includes(role))) return true

    throw new UnauthorizedException(
      plainToInstance(CommonResponseDto, {
        message: "Unauthorized.",
      }),
    )
  }
}
