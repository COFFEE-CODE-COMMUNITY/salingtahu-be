import { Command } from "@nestjs/cqrs"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"

export class LogoutCommand extends Command<CommonResponseDto> {
  public constructor(
    public readonly refreshToken: string,
    public readonly userAgent: string,
    public readonly ipAddress: string,
  ) {
    super()
  }
}
