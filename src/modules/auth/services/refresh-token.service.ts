import { Injectable } from "@nestjs/common"
import { TextHasher } from "../../../infrastructure/security/cryptography/text-hasher"
import { RefreshTokenRepository } from "../repositories/refresh-token.repository"
import { ConfigService } from "@nestjs/config"
import { User } from "../../user/entities/user.entity"
import { RefreshToken } from "../entities/refresh-token.entity"
import { randomBytes } from "crypto"
import { parse } from "useragent"
import ms, { StringValue } from "ms"

@Injectable()
export class RefreshTokenService {
  public constructor(
    private readonly textHasher: TextHasher,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly config: ConfigService,
  ) {}

  public create(user: User, userAgent: string, ipAddress: string): Promise<RefreshToken> {
    const refreshToken = new RefreshToken()
    refreshToken.user = user
    refreshToken.token = this.textHasher.hash(
      randomBytes(this.config.getOrThrow("refreshToken.bytesLength")).toString("hex"),
    )
    refreshToken.userAgent = userAgent
    refreshToken.ipAddress = ipAddress
    refreshToken.expiresAt = new Date(Date.now() + ms(this.config.getOrThrow<StringValue>("refreshToken.expiresIn")))

    return this.refreshTokenRepository.save(refreshToken)
  }

  public async verify(refreshToken: string, userAgent: string): Promise<boolean> {
    const token = await this.refreshTokenRepository.findByToken(refreshToken)

    if (!token) return false
    if (token.expiresAt < new Date()) return false
    if (token.revoked) return false

    if (token.userAgent && userAgent) {
      const agent = parse(userAgent)
      const tokenAgent = parse(token.userAgent)

      if (
        tokenAgent.family !== agent.family ||
        tokenAgent.os.toString() !== agent.os.toString() ||
        tokenAgent.device.toString() !== agent.device.toString()
      ) {
        return false
      }
    }

    return true
  }
}
