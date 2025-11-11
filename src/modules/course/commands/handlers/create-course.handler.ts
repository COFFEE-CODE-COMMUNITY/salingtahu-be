import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { CreateCourseCommand } from "../create-course.command"
import { CourseRepository } from "../../repositories/course.repository"
import { InjectMapper } from "@automapper/nestjs"
import { Mapper } from "@automapper/core"
import { CourseDto } from "../../dto/course.dto"
import { Course } from "../../entities/course.entity"
import { CourseCategoryRepository } from "../../repositories/course-category.repository"

@CommandHandler(CreateCourseCommand)
export class CreateCourseHandler implements ICommandHandler<CreateCourseCommand> {
  public constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly courseRepository: CourseRepository,
    private readonly courseCategoryRepository: CourseCategoryRepository
  ) {}

  public async execute(command: CreateCourseCommand): Promise<CourseDto> {
    const course = this.mapper.map(command.dto, CourseDto, Course)
    let category = await this.courseCategoryRepository.findByName(course.category.name)

    if (!category) {
      category = await this.courseCategoryRepository.save(course.category)
    }

    course.category = category

    return this.mapper.map(await this.courseRepository.save(course), Course, CourseDto)
  }
}
