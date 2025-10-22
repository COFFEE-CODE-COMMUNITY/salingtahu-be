import { verify } from "jsonwebtoken"
import { ConfigService } from "@nestjs/config"
import { Injectable } from "@nestjs/common"
import { TokensService } from "./tokens.service"

@Injectable()
export class AccessTokenService {
  private readonly JWT_ISSUER = "ourtransfer-client"

  public constructor(
    private readonly config: ConfigService,
    private readonly tokensService: TokensService,
  ) {}

  public async sign(userId: string): Promise<string> {
    return await this.tokensService.accessToken(userId)
  }

  public async verify(token: string): Promise<string | null> {
    try {
      const payload = verify(token, await this.config.getOrThrow("ACCESS_TOKEN_SECRET"), {
        algorithms: ["HS256"],
        issuer: this.config.get("app.domain"),
        audience: this.JWT_ISSUER,
      })

      if (typeof payload === "string") {
        return null
      }

      if (typeof payload === "object" && payload.sub) {
        return payload.sub
      }

      return null
    } catch (error) {
      return null
    }
  }
}
