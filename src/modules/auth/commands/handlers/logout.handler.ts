import { LogoutCommand } from "../logout.command"
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { CommonResponseDto } from "../../../../common/dto/common-response.dto"
import { RefreshTokenRepository } from "../../repositories/refresh-token.repository"
import { UnauthorizedException } from "@nestjs/common"
import { plainToInstance } from "class-transformer"

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  public constructor(private readonly refreshTokenRepository: RefreshTokenRepository) {}

  public async execute(command: LogoutCommand): Promise<CommonResponseDto> {
    const refreshToken = await this.refreshTokenRepository.findByToken(command.refreshToken)
    if (refreshToken?.userAgent !== command.userAgent || refreshToken.ipAddress !== command.ipAddress) {
      throw new UnauthorizedException({ message: "Token mismatch or from different device." })
    }

    refreshToken.revoke()
    await this.refreshTokenRepository.save(refreshToken)

    return plainToInstance(CommonResponseDto, {
      message: "Logout success.",
    })
  }
}
