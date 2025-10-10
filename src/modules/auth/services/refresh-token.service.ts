import { Injectable } from "@nestjs/common"
import { PasswordService } from "./password.service"
import { User } from "../../user/entities/user.entity"
import { RefreshTokenRepository } from "../repositories/refresh-token.repository"
import { TokensService } from "./tokens.service"

@Injectable()
export class RefreshTokenService {
  public constructor(
    private readonly hasher: PasswordService,
    private readonly repo: RefreshTokenRepository,
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

    return this.repo.save(option)
  }
}
