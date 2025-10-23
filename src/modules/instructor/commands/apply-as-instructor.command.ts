import { Command } from "@nestjs/cqrs"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"

export class ApplyAsInstructorCommand extends Command<CommonResponseDto> {
  public constructor(public readonly userId: string) {
    super()
  }
}
