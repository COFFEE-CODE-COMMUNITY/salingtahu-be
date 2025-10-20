import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { GetRefreshTokenCommand } from "../get-refresh-token.command"
import { RefreshTokenService } from "../../services/refresh-token.service"
import { RefreshTokenRepository } from "../../repositories/refresh-token.repository"
import { TokensDto } from "../../dtos/tokens.dto"
import { UnauthorizedException } from "@nestjs/common"
import { TokensService } from "../../services/tokens.service"

@CommandHandler(GetRefreshTokenCommand)
export class GetRefreshTokenHandler implements ICommandHandler<GetRefreshTokenCommand> {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly tokensService: TokensService,
  ) {}

  public async execute(command: GetRefreshTokenCommand): Promise<TokensDto> {
    const { refreshToken, userAgent } = command;

    if (!refreshToken) {
      throw new UnauthorizedException({ message: "Missing refresh token." });
    }

    const decoded = await this.refreshTokenService.verify(refreshToken, userAgent);
    if (!decoded) {
      throw new UnauthorizedException({ message: "Invalid or malformed refresh token." });
    }

    const tokenEntity = await this.refreshTokenRepository.findByToken(refreshToken);
    if (!tokenEntity) {
      throw new UnauthorizedException({ message: "Refresh token not found." });
    }

    if (tokenEntity.revoked) {
      throw new UnauthorizedException({ message: "Refresh token has been revoked." });
    }

    if (tokenEntity.expiresAt <= new Date()) {
      throw new UnauthorizedException({ message: "Refresh token has expired." });
    }

    const accessToken = await this.tokensService.accessToken(tokenEntity.user.id);

    const tokens = new TokensDto();
    tokens.accessToken = accessToken;

    return tokens;
  }
}
