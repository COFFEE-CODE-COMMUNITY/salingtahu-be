import { Command } from "@nestjs/cqrs"
import { ChangePasswordDto } from "../dto/change-password.dto"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"

export class ChangePasswordCommand extends Command<CommonResponseDto> {
  public constructor(
    public readonly dto: ChangePasswordDto,
    public readonly token: string,
  ) {
    super()
  }
}
