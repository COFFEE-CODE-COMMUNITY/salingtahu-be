import { Command } from "@nestjs/cqrs"
import { VerifyInstructorResponseDto } from "../dto/apply-as-instructor-response.dto"

export class VerifyInstructorCommand extends Command<VerifyInstructorResponseDto> {
  public constructor(public readonly userId: string) {
    super()
  }
}
