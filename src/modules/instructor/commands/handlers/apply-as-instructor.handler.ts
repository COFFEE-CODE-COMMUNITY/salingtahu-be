import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { ApplyAsInstructorCommand } from "../apply-as-instructor.command"
import { CommonResponseDto } from "../../../../common/dto/common-response.dto"
import { UserRepository } from "../../../user/repositories/user.repository"
import { InstructorRepository } from "../../repositories/instructor.repository"
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { UserRole } from "../../../user/enums/user-role.enum"
import { Instructor } from "../../entities/instructor.entity"

@CommandHandler(ApplyAsInstructorCommand)
export class ApplyAsInstructorHandler implements ICommandHandler<ApplyAsInstructorCommand> {
  public constructor(
    private readonly instructorRepository: InstructorRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute({ userId }: ApplyAsInstructorCommand): Promise<CommonResponseDto> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new NotFoundException(
        plainToInstance(CommonResponseDto, {
          message: "User not found.",
        }),
      )
    }

    if (user.roles.includes(UserRole.INSTRUCTOR)) {
      throw new ConflictException(
        plainToInstance(CommonResponseDto, {
          message: "User is already an instructor.",
        }),
      )
    }

    if (!user.headline) {
      throw new BadRequestException(
        plainToInstance(CommonResponseDto, {
          message: "User must have a headline to apply as an instructor.",
        }),
      )
    }

    if (!user.biography) {
      throw new BadRequestException(
        plainToInstance(CommonResponseDto, {
          message: "User must have a biography to apply as an instructor.",
        }),
      )
    }

    if (!user.profilePictures || user.profilePictures.length === 0) {
      throw new BadRequestException(
        plainToInstance(CommonResponseDto, {
          message: "User must have a profile picture to apply as an instructor.",
        }),
      )
    }

    const instructor = new Instructor()
    instructor.user = user

    await this.instructorRepository.insert(instructor)

    user.roles.push(UserRole.INSTRUCTOR)
    await this.userRepository.update(user.id, user)

    return plainToInstance(CommonResponseDto, {
      message: "Instructor application successful.",
    })
  }
}
