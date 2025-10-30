import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { GetRefreshTokenCommand } from "../get-refresh-token.command"
import { RefreshTokenService } from "../../services/refresh-token.service"
import { RefreshTokenRepository } from "../../repositories/refresh-token.repository"
import { TokensDto } from "../../dto/tokens.dto"
import { UnauthorizedException } from "@nestjs/common"
import { AccessTokenService } from "../../services/access-token.service"
import { UnitOfWork } from "../../../../infrastructure/database/unit-of-work/unit-of-work"
import { Logger } from "../../../../infrastructure/log/logger.abstract"
import { TextHasher } from "../../../../infrastructure/security/cryptography/text-hasher"

@CommandHandler(GetRefreshTokenCommand)
export class GetRefreshTokenHandler implements ICommandHandler<GetRefreshTokenCommand> {
  public constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly unitOfWork: UnitOfWork,
    private readonly logger: Logger,
    private readonly textHasher: TextHasher,
  ) {}

  public async execute(command: GetRefreshTokenCommand): Promise<TokensDto> {
    const [tokens, isVerify] = await this.unitOfWork.transaction<[TokensDto | null, boolean]>(async () => {
      const isRefreshTokenValid = await this.refreshTokenService.verifyAndRevoke(
        command.refreshToken,
        command.userAgent,
      )

      this.logger.debug(`Refresh token valid: ${isRefreshTokenValid}`)

      if (!isRefreshTokenValid) return [null, false]

      const oldRefreshToken = await this.refreshTokenRepository.findByToken(this.textHasher.hash(command.refreshToken))

      if (!oldRefreshToken) return [null, false]

      const refreshToken = await this.refreshTokenService.create(
        oldRefreshToken.user,
        command.userAgent,
        command.ipAddress,
      )
      const accessToken = await this.accessTokenService.sign(oldRefreshToken.user.id)
      const tokensDto = new TokensDto()
      tokensDto.accessToken = accessToken
      tokensDto.refreshToken = refreshToken

      return [tokensDto, true]
    })

    if (!isVerify || !tokens) {
      throw new UnauthorizedException({
        message: "Invalid refresh token.",
      })
    }

    return tokens
  }
}
