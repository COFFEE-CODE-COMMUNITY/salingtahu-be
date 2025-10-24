import { LogoutCommand } from "../logout.command"
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { CommonResponseDto } from "../../../../common/dto/common-response.dto"
import { UnauthorizedException } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { RefreshTokenService } from "../../services/refresh-token.service"

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  public constructor(private readonly refreshTokenService: RefreshTokenService) {}

  public async execute(command: LogoutCommand): Promise<CommonResponseDto> {
    const isValidRefreshToken = await this.refreshTokenService.verifyAndRevoke(command.refreshToken, command.userAgent)

    if (!isValidRefreshToken) {
      throw new UnauthorizedException(
        plainToInstance(CommonResponseDto, {
          message: "Invalid refresh token.",
        }),
      )
    }

    return plainToInstance(CommonResponseDto, {
      message: "Logout success.",
    })
  }
}
