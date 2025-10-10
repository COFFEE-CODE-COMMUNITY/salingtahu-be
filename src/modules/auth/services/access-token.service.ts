import { sign, verify } from "jsonwebtoken"
import { ConfigService } from "@nestjs/config"
import { Injectable } from "@nestjs/common"

@Injectable()
export class AccessTokenService {
  private readonly JWT_ISSUER = "ourtransfer-client"

  public constructor(private readonly config: ConfigService) {}

  public async sign(userId: string): Promise<string> {
    const secret = this.config.get("ACCESS_TOKEN_SECRET")
    return sign({ sub: userId }, secret, {
      algorithm: "HS256",
      issuer: this.config.get("app.domain"),
      audience: this.JWT_ISSUER,
      expiresIn: "1h",
    })
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
