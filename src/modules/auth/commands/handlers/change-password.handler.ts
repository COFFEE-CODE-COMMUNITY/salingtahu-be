import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { ChangePasswordCommand } from "../change-password.command"
import { CommonResponseDto } from "../../../../common/dto/common-response.dto"
import { Cache } from "../../../../infrastructure/cache/cache"
import { BadRequestException, UnauthorizedException } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { PasswordService } from "../../services/password.service"
import { RefreshTokenRepository } from "../../repositories/refresh-token.repository"
import { UserRepository } from "../../../user/repositories/user.repository"
import { User } from "../../../user/entities/user.entity"

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand> {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly cache: Cache,
    private readonly passwordService: PasswordService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async execute(command: ChangePasswordCommand): Promise<CommonResponseDto> {
    const userEmail = await this.cache.get<string>(`token:${command.token}`)
    if (!userEmail) {
      throw new UnauthorizedException(
        plainToInstance(CommonResponseDto, {
          message: "Invalid session.",
        }),
      )
    }
    const hashed = await this.passwordService.hash(command.dto.password)

    const user = await this.userRepository.findByEmail(userEmail)
    if (!user) {
      throw new BadRequestException(
        plainToInstance(CommonResponseDto, {
          message: "Cannot find email",
        }),
      )
    } else if (user.password) {
      const isUsed = await this.passwordService.compare(user.password, hashed)
      if (isUsed) {
        throw new BadRequestException(
          plainToInstance(CommonResponseDto, {
            message: "New password cannot be same as old password",
          }),
        )
      }
    }

    //Need to create new repository
    await this.userRepository.update(user.id, {
      password: hashed,
    } as User)

    if (command.dto.logoutAll && command.refreshToken) {
      const refreshToken = await this.refreshTokenRepository.findByToken(command.refreshToken)
      if (!refreshToken) throw new UnauthorizedException("Refresh token not found")

      refreshToken.revoke()
      await this.refreshTokenRepository.save(refreshToken)
    }

    return plainToInstance(CommonResponseDto, {
      message: "Password changed successfully.",
    })
  }
}
