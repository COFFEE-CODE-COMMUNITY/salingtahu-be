import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { sign, SignOptions } from "jsonwebtoken"
import ms from "ms"

@Injectable()
export class TokensService {
  private readonly JWT_AUDIENCE = "ourtransfer-client"

  public constructor(private readonly config: ConfigService) {}

  public async accessToken(userId: string): Promise<string> {
    const secret = this.config.get("ACCESS_TOKEN_SECRET")
    const option: SignOptions = {
      algorithm: "HS256",
      issuer: this.config.get("app.domain"),
      audience: this.JWT_AUDIENCE,
      expiresIn: "1h"
    }

    return new Promise((resolve, reject) => {
      sign({ sub: userId }, secret, option, (err, token) => {
        if (err || !token) {
          reject(err)
          return
        }
        resolve(token)
      })
    })
  }

  public async refreshToken(userId: string): Promise<{ token: string; exp: Date }> {
    const secret = this.config.get("ACCESS_TOKEN_SECRET")
    const expiresIn = "7d"
    const exp = new Date(Date.now() + ms(expiresIn))

    const options: SignOptions = {
      algorithm: "HS256",
      issuer: this.config.get("app.domain"),
      audience: this.JWT_AUDIENCE,
      expiresIn
    }

    const token = sign({ sub: userId }, secret, options)
    return { token, exp }
  }
}
