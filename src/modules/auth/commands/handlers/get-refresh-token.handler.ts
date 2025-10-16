import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { GetRefreshTokenCommand } from "../get-refresh-token.command"
import { RefreshTokenService } from "../../services/refresh-token.service"
import { RefreshTokenRepository } from "../../repositories/refresh-token.repository"
import { TokensDto } from "../../dtos/tokens.dto"
import { UnauthorizedException } from "@nestjs/common"
import { TokensService } from "../../services/tokens.service"

@CommandHandler(GetRefreshTokenCommand)
export class GetRefreshTokenHandler implements ICommandHandler<GetRefreshTokenCommand> {
  public constructor(
    private readonly refreshTokenService: RefreshTokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokensService: TokensService,
  ) {}

  public async execute(command: GetRefreshTokenCommand): Promise<TokensDto> {
    const isRefreshTokenValid = await this.refreshTokenService.verify(command.refreshToken, command.userAgent)

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException({
        message: 'Invalid refresh token.',
      })
    }

    const oldRefreshToken = await this.refreshTokenRepository.findByToken(command.refreshToken)

    if (!oldRefreshToken) {
      throw new UnauthorizedException({
        message: 'Invalid refresh token.',
      })
    }

    const refreshToken = await this.refreshTokenService.create(
      oldRefreshToken.user,
      command.userAgent,
      command.ipAddress,
    )

    const accessToken = await this.tokensService.accessToken(oldRefreshToken.id)
    const tokens = new TokensDto()
    tokens.accessToken = accessToken
    tokens.refreshToken = refreshToken.token

    return tokens
  }

}
