import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { ChangePasswordCommand } from "../change-password.command"
import { CommonResponseDto } from "../../../../dto/common-response.dto"
import { UnauthorizedException } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { PasswordService } from "../../services/password.service"
import { RefreshTokenRepository } from "../../repositories/refresh-token.repository"
import { UserRepository } from "../../../user/repositories/user.repository"
import { PasswordResetSessionRepository } from "../../repositories/password-reset-session.repository"
import { TextHasher } from "../../../../security/cryptography/text-hasher"
import { UnitOfWork } from "../../../../database/unit-of-work/unit-of-work"

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand> {
  public constructor(
    private readonly passwordResetSessionRepository: PasswordResetSessionRepository,
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly textHasher: TextHasher,
    private readonly unitOfWork: UnitOfWork
  ) {}

  public async execute(command: ChangePasswordCommand): Promise<CommonResponseDto> {
    const passwordResetSession = await this.passwordResetSessionRepository.findByToken(
      this.textHasher.hash(command.token)
    )

    if (!passwordResetSession || passwordResetSession.isExpired()) {
      throw new UnauthorizedException(
        plainToInstance(CommonResponseDto, {
          message: "Invalid or expired password reset token."
        })
      )
    }

    await this.unitOfWork.transaction(async () => {
      const user = passwordResetSession.user
      user.password = await this.passwordService.hash(command.dto.password)

      await this.userRepository.update(user)

      if (command.dto.logoutAll) {
        const refreshTokens = await this.refreshTokenRepository.findActiveByUserId(user.id)

        for (const refreshToken of refreshTokens) {
          refreshToken.revoke()

          await this.refreshTokenRepository.update(refreshToken)
        }
      }
    })

    return plainToInstance(CommonResponseDto, {
      message: "Password changed successfully."
    })
  }
}
