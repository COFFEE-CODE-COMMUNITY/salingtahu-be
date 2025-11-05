import { Command } from "@nestjs/cqrs"
import { CommonResponseDto } from "../../../dto/common-response.dto"
import { RegisterDto } from "../dto/register.dto"

export class RegisterCommand extends Command<CommonResponseDto> {
  public constructor(public dto: RegisterDto) {
    super()
  }
}
