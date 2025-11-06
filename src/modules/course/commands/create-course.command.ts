import { Command } from "@nestjs/cqrs"
import { CourseDto } from "../dto/course.dto"

export class CreateCourseCommand extends Command<CourseDto> {
  public constructor(public readonly dto: CourseDto) {
    super()
  }
}
