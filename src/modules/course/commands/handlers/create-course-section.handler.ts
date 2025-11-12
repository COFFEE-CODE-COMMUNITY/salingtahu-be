import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { CreateCourseSectionCommand } from "../create-course-section.command"
import { CourseSectionDto } from "../../dto/course-section.dto"
import { CourseRepository } from "../../repositories/course.repository"
import { CourseSectionRepository } from "../../repositories/course-section.repository"
import { InjectMapper } from "@automapper/nestjs"
import { Mapper } from "@automapper/core"
import { NotFoundException } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { CommonResponseDto } from "../../../../dto/common-response.dto"
import { CourseSection } from "../../entities/course-section.entity"

@CommandHandler(CreateCourseSectionCommand)
export class CreateCourseSectionHandler implements ICommandHandler<CreateCourseSectionCommand> {
  public constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly courseRepository: CourseRepository,
    private readonly courseSectionRepository: CourseSectionRepository
  ) {}

  public async execute(command: CreateCourseSectionCommand): Promise<CourseSectionDto> {
    const course = await this.courseRepository.findByIdOrSlug(command.courseIdOrSlug)

    if (!course) {
      throw new NotFoundException(
        plainToInstance(CommonResponseDto, {
          message: "Course not found."
        })
      )
    }

    const courseSection = this.mapper.map(command.dto, CourseSectionDto, CourseSection)
    courseSection.course = course

    return this.mapper.map(await this.courseSectionRepository.save(courseSection), CourseSection, CourseSectionDto)
  }
}
