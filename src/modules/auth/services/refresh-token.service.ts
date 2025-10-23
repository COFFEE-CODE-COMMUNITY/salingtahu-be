import { Injectable } from "@nestjs/common"
import { User } from "../../user/entities/user.entity"
import { RefreshTokenRepository } from "../repositories/refresh-token.repository"
import { RefreshToken } from "../entities/refresh-token.entity"
import { parse } from "useragent"
import { REFRESH_TOKEN_EXPIRES_MS } from "../constants/auth.constant"
import { randomBytes } from "crypto"
import { TextHasher } from "../../../infrastructure/security/cryptography/text-hasher"

@Injectable()
export class RefreshTokenService {
  private readonly REFRESH_TOKEN_BYTES_LENGTH = 32

  public constructor(
    private readonly textHasher: TextHasher,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async create(user: User, userAgent: string, ipAddress: string): Promise<string> {
    const tokenString = randomBytes(this.REFRESH_TOKEN_BYTES_LENGTH).toString("hex")
    const refreshToken = new RefreshToken()
    refreshToken.user = user
    refreshToken.token = this.textHasher.hash(tokenString)
    refreshToken.userAgent = userAgent
    refreshToken.ipAddress = ipAddress
    refreshToken.expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS)

    await this.refreshTokenRepository.insert(refreshToken)

    return tokenString
  }

  public async verifyAndRevoke(refreshToken: string, userAgent: string): Promise<boolean> {
    if (!refreshToken) return false
    
    const token = await this.refreshTokenRepository.findByToken(this.textHasher.hash(refreshToken))

    if (!token) return false
    if (token.expiresAt < new Date()) return false
    if (token.revoked) return false

    // Verify User-Agent matches
    if (token.userAgent !== userAgent) {
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

    token.revoke()
    await this.refreshTokenRepository.update(token)

    return true
  }
}
