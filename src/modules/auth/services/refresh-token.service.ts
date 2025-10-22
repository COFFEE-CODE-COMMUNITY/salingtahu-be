import { Injectable } from "@nestjs/common"
import { PasswordService } from "./password.service"
import { User } from "../../user/entities/user.entity"
import { RefreshTokenRepository } from "../repositories/refresh-token.repository"
import { TokensService } from "./tokens.service"
import { parse } from "useragent"

@Injectable()
export class RefreshTokenService {
  public constructor(
    private readonly hasher: PasswordService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly token: TokensService,
  ) {}

  // async updateRefreshToken(userId: number, refreshToken: string) {
  //   const hash = await this.hasher.hash(refreshToken)
  //   await this.userService.update(userId, { hashedRt: hash })
  // }
  //
  // async removeRefreshToken(userId: number) {
  //   await this.userService.update(userId, { hashedRt: null })
  // }

  public async create(user: User, userAgent: string, ipAddress: string): Promise<any> {
    const { token: rt, exp } = await this.token.refreshToken(user.id)
    const hashedRt = await this.hasher.hash(rt)

    const option: any = {
      user: user,
      token: hashedRt,
      userAgent: userAgent,
      ipAddress: ipAddress,
      expiresAt: exp,
    }

    return this.refreshTokenRepository.save(option)
  }

  public async verify(refreshToken: string, userAgent: string): Promise<boolean> {
    const token = await this.refreshTokenRepository.findByToken(refreshToken)

    if (!token) return false
    if (token.expiresAt < new Date()) return false
    if (token.revoked) return false

    if (token.userAgent === userAgent) {
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
