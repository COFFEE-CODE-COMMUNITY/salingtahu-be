import { Command } from "@nestjs/cqrs"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"
import { PasswordResetDto } from "../dtos/password-reset.dto"

export class PasswordResetCommand extends Command<CommonResponseDto> {
  public constructor(public readonly dto: PasswordResetDto) {
    super()
  }
}
