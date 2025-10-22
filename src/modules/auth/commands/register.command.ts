import { Command } from "@nestjs/cqrs"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"
import { RegisterDto } from "../dtos/register.dto"

export class RegisterCommand extends Command<CommonResponseDto> {
  public constructor(public dto: RegisterDto) {
    super()
  }
}
