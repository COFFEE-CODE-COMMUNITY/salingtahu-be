import { ApiProperty } from "@nestjs/swagger"
import { PaginationDto } from "../../../dto/pagination.dto"
import { CourseDto } from "./course.dto"

export class CoursesDto extends PaginationDto<CourseDto> {
  @ApiProperty({
    description: "Array of course objects in the current page",
    type: [CourseDto],
    isArray: true
  })
  declare public data: CourseDto[]
}
