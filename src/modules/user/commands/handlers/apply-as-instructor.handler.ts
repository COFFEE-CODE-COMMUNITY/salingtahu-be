import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { ApplyAsInstructorCommand } from "../apply-as-instructor.command"
import { CommonResponseDto } from "../../../../dto/common-response.dto"
import { UserRepository } from "../../../user/repositories/user.repository"
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { UserRole } from "../../../user/enums/user-role.enum"
import { VeriffService } from "../../../../services/veriff.service"
import { ApplyAsInstructorResponseDto } from "../../../user/dto/apply-as-instructor-response.dto"

@CommandHandler(ApplyAsInstructorCommand)
export class ApplyAsInstructorHandler implements ICommandHandler<ApplyAsInstructorCommand> {
  public constructor(
    private readonly veriffService: VeriffService,
    private readonly userRepository: UserRepository
  ) {}

  public async execute({ userId }: ApplyAsInstructorCommand): Promise<ApplyAsInstructorResponseDto> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new NotFoundException(
        plainToInstance(CommonResponseDto, {
          message: "User not found."
        })
      )
    }

    if (user.roles.includes(UserRole.INSTRUCTOR)) {
      throw new ConflictException(
        plainToInstance(CommonResponseDto, {
          message: "User is already an instructor."
        })
      )
    }

    if (!user.headline || !user.biography || !user.profilePictures || user.profilePictures.length === 0) {
      throw new BadRequestException(
        plainToInstance(CommonResponseDto, {
          message: "User must have a headline, biography, and profile picture to apply as an instructor."
        })
      )
    }

    const { sessionId, url } = await this.veriffService.createVerificationSession(user)
    const dto = new ApplyAsInstructorResponseDto()
    dto.sessionId = sessionId
    dto.url = url

    return dto
  }
}
