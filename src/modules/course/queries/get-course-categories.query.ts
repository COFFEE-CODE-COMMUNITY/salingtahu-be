import { Query } from "@nestjs/cqrs"
import { PaginationDto } from "../../../dto/pagination.dto"
import { CourseCategoryDto } from "../dto/course-category.dto"

export class GetCourseCategoriesQuery extends Query<PaginationDto<CourseCategoryDto>> {
  public constructor(
    public readonly offset: number = 0,
    public readonly limit: number = 100,
    public readonly search?: string
  ) {
    super()
  }
}
