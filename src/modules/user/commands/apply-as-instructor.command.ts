import { Command } from "@nestjs/cqrs"
import { ApplyAsInstructorResponseDto } from "../../user/dto/apply-as-instructor-response.dto"

export class ApplyAsInstructorCommand extends Command<ApplyAsInstructorResponseDto> {
  public constructor(public readonly userId: string) {
    super()
  }
}
