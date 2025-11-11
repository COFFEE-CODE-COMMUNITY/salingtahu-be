import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetCourseCategoriesQuery } from "../get-course-categories.query"
import { PaginationDto } from "../../../../dto/pagination.dto"
import { CourseCategoryDto } from "../../dto/course-category.dto"
import { FindOptionsWhere, ILike } from "typeorm"
import { CourseCategory } from "../../entities/course-category.entity"
import { PaginationFactory } from "../../../../factories/pagination.factory"
import { Pagination } from "../../../../utils/pagination.util"

@QueryHandler(GetCourseCategoriesQuery)
export class GetCourseCategoriesHandler implements IQueryHandler<GetCourseCategoriesQuery> {
  private readonly pagination: Pagination<CourseCategory, CourseCategoryDto>

  public constructor(private readonly paginationFactory: PaginationFactory) {
    this.pagination = this.paginationFactory.create(CourseCategory, CourseCategoryDto)
  }

  public async execute(query: GetCourseCategoriesQuery): Promise<PaginationDto<CourseCategoryDto>> {
    let where: FindOptionsWhere<CourseCategory> = {}

    if (query.search) {
      where = { name: ILike(`%${query.search}%`) }
    }

    return this.pagination.paginate(query.offset, query.limit, { where })
  }
}
