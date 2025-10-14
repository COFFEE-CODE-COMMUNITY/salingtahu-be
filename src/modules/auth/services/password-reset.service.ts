import { Injectable } from "@nestjs/common"
import { randomBytes } from "crypto"
import { EmailService } from "../../../infrastructure/email/email.service"
import { Cache } from "../../../infrastructure/cache/cache"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class PasswordResetService {
  private readonly RESET_PASSWORD_SESSION_TTL = 600

  public constructor(
    private readonly emailService: EmailService,
    private readonly cache: Cache,
    private readonly config: ConfigService,
  ) {}

  public async verifyEmail(email: string): Promise<void> {
    console.time("verifyEmail")
    console.log("[DEBUG] Start verifyEmail", email)

    const token = this.generateToken()
    console.log("[DEBUG] Token generated", token)

    const url = new URL(`${this.config.getOrThrow("client.web.changePassword")}`)
    url.searchParams.set("token", token)

    await this.cache.set(`token:${token}`, email, this.RESET_PASSWORD_SESSION_TTL)
    console.log("[DEBUG] Token cached in Redis")

    this.emailService
      .send(email, "Please follow this link to change your password", {
        name: "password-reset",
        payload: {
          setPasswordUrl: url.toString(),
        },
      })
      .then(() => {
        console.log("[DEBUG] Email queued successfully")
      })
      .catch(err => {
        console.error("[DEBUG] Email send failed", err)
      })

    console.timeEnd("verifyEmail")
  }

  private generateToken(): string {
    return randomBytes(32).toString("hex")
  }
}
