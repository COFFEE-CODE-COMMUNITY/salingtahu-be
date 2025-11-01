import { Command } from "@nestjs/cqrs"
import { TokensDto } from "../dto/tokens.dto"

export class GetRefreshTokenCommand extends Command<TokensDto> {
  public constructor(
    public readonly refreshToken: string,
    public readonly userAgent: string,
    public readonly ipAddress: string
  ) {
    super()
  }
}
