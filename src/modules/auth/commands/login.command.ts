import { Command } from "@nestjs/cqrs"
import { TokensDto } from "../dto/tokens.dto"
import { LoginDto } from "../dto/login.dto"

export class LoginCommand extends Command<TokensDto> {
  public constructor(
    public readonly dto: LoginDto,
    public readonly userAgent: string,
    public readonly ipAddress: string,
  ) {
    super()
  }
}
