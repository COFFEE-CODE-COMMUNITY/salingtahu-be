import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { UpdateCourseStatusCommand } from "../update-course-status.command"
import { AdminRepository } from "../../repositories/admin.repository"
import { NotFoundException } from "@nestjs/common"
import { Course } from "../../../course/entities/course.entity"
import { CourseStatus } from "../../../course/enums/course-status.enum"

@CommandHandler(UpdateCourseStatusCommand)
export class UpdateCourseStatusHandler implements ICommandHandler<UpdateCourseStatusCommand> {
  public constructor(private readonly adminRepository: AdminRepository) {}

  public async execute(dto: UpdateCourseStatusCommand): Promise<any> {
    const course = await this.adminRepository.findByIdOrSlug(dto.courseIdOrSlug)

    if (!course) {
      return new NotFoundException({
        message: "Course is not found"
      })
    }

    await this.adminRepository.update(course.id, { status: CourseStatus.PUBLISHED } as Partial<Course>)
  }
}
