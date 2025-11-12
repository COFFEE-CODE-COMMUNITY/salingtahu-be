import { ApiProperty } from "@nestjs/swagger"
import { PaginationDto } from "../../../dto/pagination.dto"
import { CourseCategoryDto } from "./course-category.dto"

export class CourseCategoriesDto extends PaginationDto<CourseCategoryDto> {
  @ApiProperty({
    description: "Array of course category objects in the current page",
    type: [CourseCategoryDto],
    isArray: true
  })
  declare public data: CourseCategoryDto[]
}
