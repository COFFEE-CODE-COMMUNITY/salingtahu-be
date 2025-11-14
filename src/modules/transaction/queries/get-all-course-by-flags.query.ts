import { Query } from "@nestjs/cqrs"
import { PaginationDto } from "../../../dto/pagination.dto"
import { CourseDto } from "../../course/dto/course.dto"
import { CourseSortBy } from "../../course/enums/course-sort-by.enum"
import { SortOrder } from "../../../enums/sort-order"

export class GetAllCourseByFlagsQuery extends Query<PaginationDto<CourseDto>> {
  public constructor(
    public readonly userId: string,
    public readonly flags: boolean,
    public readonly offset: number,
    public readonly limit: number,
    public readonly sortBy: CourseSortBy,
    public readonly sortOrder: SortOrder,
    public readonly search?: string
  ) {
    super()
  }
}
