import { Command } from "@nestjs/cqrs"
import { CourseSectionDto } from "../dto/course-section.dto"

export class CreateCourseSectionCommand extends Command<CourseSectionDto> {
  public constructor(
    public readonly courseIdOrSlug: string,
    public readonly dto: CourseSectionDto
  ) {
    super()
  }
}
