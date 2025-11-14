import { Command } from "@nestjs/cqrs"
import { UpdateCourseStatusRequestDto } from "../dtos/update-course-status-request.dto"

export class UpdateCourseStatusCommand extends Command<any> {
  public constructor(
    public readonly courseIdOrSlug: string,
    public readonly dto: UpdateCourseStatusRequestDto
  ) {
    super()
  }
}
