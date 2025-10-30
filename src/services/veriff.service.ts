import { Injectable, UnauthorizedException } from "@nestjs/common"
import { User } from "../modules/user/entities/user.entity"
import { HttpService } from "@nestjs/axios"
import { ConfigService } from "@nestjs/config"
import { lastValueFrom } from "rxjs"
import { Logger } from "../infrastructure/log/logger.abstract"
import { createHmac } from "crypto"
import { DecisionWebhook, CreateVerificationSession } from "../types/veriff"
import { plainToInstance } from "class-transformer"
import { CommonResponseDto } from "../common/dto/common-response.dto"

@Injectable()
export class VeriffService {
  private readonly VERIFF_BASE_URL: string
  private readonly VERIFF_API_KEY: string

  public constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
    private readonly logger: Logger,
  ) {
    this.VERIFF_BASE_URL = this.config.getOrThrow<string>("VERIFF_BASE_URL")
    this.VERIFF_API_KEY = this.config.getOrThrow<string>("VERIFF_API_KEY")
  }

  public async createVerifySession(user: User): Promise<IdentityVerifySession> {
    try {
      const body: CreateVerificationSession.Request.Body = {
        verification: {
          callback: "",
          person: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
          vendorData: user.id,
        },
      }
      const { data } = await lastValueFrom(
        this.http.post<CreateVerificationSession.Response.Body, CreateVerificationSession.Request.Body>(
          `${this.VERIFF_BASE_URL}/sessions`,
          body,
          {
            headers: {
              "X-Auth-Client": this.VERIFF_API_KEY,
              "X-Hmac-Signature": this.getHmacSignature(body),
            },
          },
        ),
      )

      return {
        sessionId: data.verification.id,
        url: data.verification.url,
      }
    } catch (error) {
      this.logger.error("Error when creating Veriff verification session", error)

      throw error
    }
  }

  public async verifyDecisionWebHook(payload: DecisionWebhook.Payload, headers: DecisionWebhookHeaders): Promise<void> {
    const expectedHmac = this.getHmacSignature(payload)

    if (headers.hmacSignature !== expectedHmac) {
      this.logger.warn("Invalid HMAC signature in Veriff webhook")

      throw new UnauthorizedException(
        plainToInstance(CommonResponseDto, {
          message: "Invalid HMAC signature",
        }),
      )
    }
  }

  private getHmacSignature(body: object): string {
    return createHmac("sha256", this.config.getOrThrow("VERIFF_SECRET_KEY")).update(JSON.stringify(body)).digest("hex")
  }
}

export interface IdentityVerifySession {
  sessionId: string
  url: string
}

export interface DecisionWebhookHeaders {
  authClient: string
  hmacSignature: string
  integrationId: string
}
