import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { ChangePasswordCommand } from "../change-password.command"
import { CommonResponseDto } from "../../../../common/dto/common-response.dto"
import { Cache } from "../../../../infrastructure/cache/cache"
import { BadRequestException, UnauthorizedException } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { PasswordService } from "../../services/password.service"
import { RefreshTokenRepository } from "../../repositories/refresh-token.repository"

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand> {
  public constructor(
    private readonly userRepository: any,
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
    if (user?.password) {
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
    await this.userRepository.setPassword(hashed)
    if (command.dto.logoutAll) {
      if (!command.refreshToken) throw new UnauthorizedException("No refresh token found")

      await this.refreshTokenRepository.deleteByToken(command.refreshToken)
    }

    return plainToInstance(CommonResponseDto, {
      message: "Password changed successfully.",
    })
  }
}
