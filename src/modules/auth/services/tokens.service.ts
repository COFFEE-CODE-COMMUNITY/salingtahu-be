// import { Injectable, UnauthorizedException } from "@nestjs/common"
// import { JwtService } from "@nestjs/jwt"
// import { ConfigService } from "@nestjs/config"
// import { TokensDto } from "../dto/tokens.dto"
//
// @Injectable()
// export class TokensService {
//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly configService: ConfigService,
//   ) {}
//
//   async generateTokens(userId: string): Promise<TokensDto> {
//     const [accessToken, refreshToken] = await Promise.all([this.signAccessToken(userId), this.signRefreshToken(userId)])
//
//     return { accessToken, refreshToken }
//   }
//
//   async signAccessToken(userId: string): Promise<string> {
//     const accessSecret = this.configService.getOrThrow<string>("auth.accessTokenSecret")
//     return this.jwtService.signAsync(
//       { sub: userId },
//       {
//         secret: accessSecret,
//         expiresIn: this.configService.get<string>("auth.accessTokenExpiresIn") || "15m",
//       },
//     )
//   }
//
//   async signRefreshToken(userId: string): Promise<string> {
//     const refreshSecret = this.configService.getOrThrow<string>("auth.refreshTokenSecret")
//     return this.jwtService.signAsync(
//       { sub: userId },
//       {
//         secret: refreshSecret,
//         expiresIn: this.configService.get<string>("auth.refreshTokenExpiresIn") || "7d",
//       },
//     )
//   }
//
//   async verifyRefreshToken(token: string): Promise<string> {
//     const refreshSecret = this.configService.getOrThrow<string>("auth.refreshTokenSecret")
//     try {
//       const payload = await this.jwtService.verifyAsync<{ sub: string }>(token, {
//         secret: refreshSecret,
//       })
//
//       return payload.sub
//     } catch {
//       throw new UnauthorizedException("Refresh token invalid or expired")
//     }
//   }
// }
