import { Query } from "@nestjs/cqrs"
import { CourseDto } from "../dto/course.dto"

export class GetCourseQuery extends Query<CourseDto> {
  public constructor(public readonly courseIdOrSlug: string) {
    super()
  }
}
