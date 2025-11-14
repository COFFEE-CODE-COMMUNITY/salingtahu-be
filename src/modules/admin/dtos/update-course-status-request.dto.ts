import { ApiProperty } from "@nestjs/swagger"
import { CourseStatus } from "../../course/enums/course-status.enum"

export class UpdateCourseStatusRequestDto {
  @ApiProperty()
  public status!: CourseStatus
}
