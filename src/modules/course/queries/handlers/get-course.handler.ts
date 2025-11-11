import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetCourseQuery } from "../get-course.query"
import { CourseDto } from "../../dto/course.dto"
import { InjectMapper } from "@automapper/nestjs"
import { Mapper } from "@automapper/core"
import { CourseRepository } from "../../repositories/course.repository"
import { NotFoundException } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { CommonResponseDto } from "../../../../dto/common-response.dto"
import { Course } from "../../entities/course.entity"

@QueryHandler(GetCourseQuery)
export class GetCourseHandler implements IQueryHandler<GetCourseQuery> {
  public constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly courseRepository: CourseRepository
  ) {}

  public async execute(query: GetCourseQuery): Promise<CourseDto> {
    const course = await this.courseRepository.findByIdOrSlug(query.courseIdOrSlug)

    if (!course) {
      throw new NotFoundException(
        plainToInstance(CommonResponseDto, {
          message: `Course with id or slug '${query.courseIdOrSlug}' not found`
        })
      )
    }

    return this.mapper.map(course, Course, CourseDto)
  }
}
