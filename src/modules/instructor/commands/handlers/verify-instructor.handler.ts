import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { VerifyInstructorCommand } from "../verify-instructor.command"
import { VerifyInstructorResponseDto } from "../../dto/apply-as-instructor-response.dto"
import { UserRepository } from "../../../user/repositories/user.repository"
import { VeriffService } from "../../../../services/veriff.service"
import { NotFoundException } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { CommonResponseDto } from "../../../../common/dto/common-response.dto"

@CommandHandler(VerifyInstructorCommand)
export class VerifyInstructorHandler implements ICommandHandler<VerifyInstructorCommand> {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly veriffService: VeriffService,
  ) {}

  public async execute(command: VerifyInstructorCommand): Promise<VerifyInstructorResponseDto> {
    const user = await this.userRepository.findById(command.userId)

    if (!user) {
      throw new NotFoundException(
        plainToInstance(CommonResponseDto, {
          message: "User not found.",
        }),
      )
    }

    const verificationSession = await this.veriffService.createVerifySession(user)
    const dto = new VerifyInstructorResponseDto()
    dto.sessionId = verificationSession.sessionId
    dto.url = verificationSession.url

    return dto
  }
}
