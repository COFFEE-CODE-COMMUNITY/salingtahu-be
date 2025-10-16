import { Injectable } from "@nestjs/common"
import { randomBytes } from "crypto"
import { EmailService } from "../../../infrastructure/email/email.service"
import { Cache } from "../../../infrastructure/cache/cache"
import { ConfigService } from "@nestjs/config"
import { Logger } from "../../../infrastructure/log/logger.abstract"

@Injectable()
export class PasswordResetService {
  private readonly RESET_PASSWORD_SESSION_TTL = 600

  public constructor(
    private readonly emailService: EmailService,
    private readonly cache: Cache,
    private readonly config: ConfigService,
    private readonly logger: Logger,
  ) {}

  public async verifyEmail(email: string): Promise<string> {
    try {
      const token = this.generateToken()

      const url = new URL(`${this.config.getOrThrow("client.web.changePassword")}`)
      url.searchParams.set("token", token)

      await this.cache.set(`token:${token}`, email, this.RESET_PASSWORD_SESSION_TTL)

      await this.emailService.send(email, "Please follow this link to change your password", {
        name: "password-reset",
        payload: {
          setPasswordUrl: url.toString(),
        },
      })

      this.logger.info(`Sent email sent to ${url.toString()}`)
      return "A verification code has send to the email. Please check your inbox."
    } catch (error) {
      this.logger.error("Occured error: ", error)
      return "Something went wrong!"
    }
  }

  private generateToken(): string {
    return randomBytes(32).toString("hex")
  }
}
