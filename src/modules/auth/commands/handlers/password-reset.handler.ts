import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { PasswordResetCommand } from "../password-reset.command"
import { UserRepository } from "../../../user/repositories/user.repository"
import { CommonResponseDto } from "../../../../dto/common-response.dto"
import { plainToInstance } from "class-transformer"
import { NotFoundException } from "@nestjs/common"
import { PasswordResetSession } from "../../entities/password-reset-session.entity"
import { randomBytes } from "crypto"
import { Logger } from "../../../../log/logger.abstract"
import { PasswordResetSessionRepository } from "../../repositories/password-reset-session.repository"
import ms from "ms"
import { EmailService } from "../../../../email/email.service"
import { ConfigService } from "@nestjs/config"
import { TextHasher } from "../../../../security/cryptography/text-hasher"

@CommandHandler(PasswordResetCommand)
export class PasswordResetHandler implements ICommandHandler<PasswordResetCommand> {
  private readonly RESET_PASSWORD_SESSION_TTL = ms("10m") // 10 minutes
  private readonly SESSION_TOKEN_LENGTH = 32

  public constructor(
    private readonly config: ConfigService,
    private readonly emailService: EmailService,
    private readonly passwordResetSessionRepository: PasswordResetSessionRepository,
    private readonly userRepository: UserRepository,
    private readonly textHasher: TextHasher,
    private readonly logger: Logger
  ) {}

  public async execute(command: PasswordResetCommand): Promise<CommonResponseDto> {
    const user = await this.userRepository.findByEmail(command.dto.email)

    if (!user) {
      throw new NotFoundException(
        plainToInstance(CommonResponseDto, {
          message: "Email not found."
        })
      )
    }

    try {
      const sessionToken = randomBytes(this.SESSION_TOKEN_LENGTH).toString("hex")
      const passwordResetSession = new PasswordResetSession()
      passwordResetSession.token = this.textHasher.hash(sessionToken)
      passwordResetSession.user = user
      passwordResetSession.expiresAt = new Date(Date.now() + this.RESET_PASSWORD_SESSION_TTL)

      await this.passwordResetSessionRepository.insert(passwordResetSession)

      const setPasswordUrl = new URL(this.config.getOrThrow("client.web.changePassword"))
      setPasswordUrl.searchParams.set("token", sessionToken)

      await this.emailService.send(user.email, "Password Reset Request", {
        name: "password-reset",
        payload: {
          setPasswordUrl: setPasswordUrl.toString()
        }
      })

      return plainToInstance(CommonResponseDto, {
        message: "A verification code has been sent to the email. Please check your inbox or spam mail."
      })
    } catch (error) {
      this.logger.error("Occurred error: ", error)

      throw error
    }
  }
}
