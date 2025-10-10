import { Injectable } from "@nestjs/common"
import { PasswordService } from "./password.service"
import { JwtService } from "@nestjs/jwt"
import { User } from "../../user/entities/user.entity"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class RefreshTokenService {
  public constructor(
    private readonly hasher: PasswordService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // async updateRefreshToken(userId: number, refreshToken: string) {
  //   const hash = await this.hasher.hash(refreshToken)
  //   await this.userService.update(userId, { hashedRt: hash })
  // }
  //
  // async removeRefreshToken(userId: number) {
  //   await this.userService.update(userId, { hashedRt: null })
  // }

  public async create(user: User, userAgent: string, ipAddress: string): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      ua: userAgent,
      ip: ipAddress,
    }

    const [refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow("REFRESH_TOKEN_SECRET"),
        expiresIn: "7d",
      }),
    ])

    const hashedRt = await this.hasher.hash(refreshToken)
    // await this.userService.update(user.id, { hashedRt })
    console.log(hashedRt)
    return refreshToken
  }
}
