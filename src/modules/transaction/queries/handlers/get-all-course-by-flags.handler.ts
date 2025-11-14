import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetAllCourseByFlagsQuery } from "../get-all-course-by-flags.query"
import { PaginationDto } from "../../../../dto/pagination.dto"
import { CourseDto } from "../../../course/dto/course.dto"
import { Course } from "../../../course/entities/course.entity"
import { PaginationFactory } from "../../../../factories/pagination.factory"
import { Pagination } from "../../../../utils/pagination.util"
import { CourseSortBy } from "../../../course/enums/course-sort-by.enum"
import { SortOrder } from "../../../../enums/sort-order"
import { FindOptionsOrder, FindOptionsWhere, ILike, Not, In } from "typeorm"
import { TransactionRepository } from "../../repositories/transaction.repository"

@QueryHandler(GetAllCourseByFlagsQuery)
export class GetAllCourseByFlagsHandler implements IQueryHandler<GetAllCourseByFlagsQuery> {
  private readonly pagination: Pagination<Course, CourseDto>

  public constructor(
    paginationFactory: PaginationFactory,
    private readonly transactionRepository: TransactionRepository
  ) {
    this.pagination = paginationFactory.create(Course, CourseDto)
  }

  public async execute(query: GetAllCourseByFlagsQuery): Promise<PaginationDto<CourseDto>> {
    const { userId, flags, limit, offset, search, sortBy, sortOrder } = query

    let where: Array<FindOptionsWhere<Course>> = []
    let order: FindOptionsOrder<Course> = {}

    // Get all transactions for this user
    const transactions = await this.transactionRepository.findByUserId(userId)

    // Extract unique course IDs
    const purchasedCourseIds = [...new Set(transactions.map(t => t.course.id))]

    if (flags) {
      // If flags is true: find courses user has purchased
      if (purchasedCourseIds.length === 0) {
        // User hasn't purchased any courses, return empty result
        // Use a condition that will never match
        const baseWhere: FindOptionsWhere<Course> = { id: In([]) }
        if (search) {
          where = [
            { ...baseWhere, title: ILike(`%${search}%`) },
            { ...baseWhere, description: ILike(`%${search}%`) }
          ]
        } else {
          where = [baseWhere]
        }
      } else {
        // Filter by purchased course IDs
        const baseWhere: FindOptionsWhere<Course> = { id: In(purchasedCourseIds) }
        if (search) {
          where = [
            { ...baseWhere, title: ILike(`%${search}%`) },
            { ...baseWhere, description: ILike(`%${search}%`) }
          ]
        } else {
          where = [baseWhere]
        }
      }
    } else {
      // If flags is false: find courses user has NOT purchased
      if (purchasedCourseIds.length === 0) {
        // User hasn't purchased any courses, return all courses
        if (search) {
          where = [{ title: ILike(`%${search}%`) }, { description: ILike(`%${search}%`) }]
        } else {
          where = [{}]
        }
      } else {
        // Exclude purchased courses
        const baseWhere: FindOptionsWhere<Course> = { id: Not(In(purchasedCourseIds)) }
        if (search) {
          where = [
            { ...baseWhere, title: ILike(`%${search}%`) },
            { ...baseWhere, description: ILike(`%${search}%`) }
          ]
        } else {
          where = [baseWhere]
        }
      }
    }

    // Build order clause based on sortBy and sortOrder
    switch (sortBy) {
      case CourseSortBy.NAME:
        order = { title: sortOrder === SortOrder.ASCENDING ? "ASC" : "DESC" }
        break
      case CourseSortBy.PRICE:
        order = { price: sortOrder === SortOrder.ASCENDING ? "ASC" : "DESC" }
        break
      case CourseSortBy.RATING:
        order = { averageRating: sortOrder === SortOrder.ASCENDING ? "ASC" : "DESC" }
        break
      case CourseSortBy.OLDEST:
        order = { createdAt: sortOrder === SortOrder.ASCENDING ? "ASC" : "DESC" }
        break
      case CourseSortBy.NEWEST:
      default:
        order = { createdAt: sortOrder === SortOrder.ASCENDING ? "DESC" : "ASC" }
        break
    }

    return this.pagination.paginate(offset, limit, {
      where,
      order,
      relations: { instructor: true, category: true }
    })
  }
}
