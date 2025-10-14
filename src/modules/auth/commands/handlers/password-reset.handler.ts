import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { PasswordResetCommand } from "../password-reset.command"
import { PasswordResetService } from "../../services/password-reset.service"
import { UserRepository } from "../../../user/repositories/user.repository"
import { CommonResponseDto } from "../../../../common/dto/common-response.dto"
import { plainToInstance } from "class-transformer"
import { NotFoundException } from "@nestjs/common"

@CommandHandler(PasswordResetCommand)
export class PasswordResetHandler implements ICommandHandler<PasswordResetCommand> {
  public constructor(
    private readonly passwordResetService: PasswordResetService,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(command: PasswordResetCommand): Promise<CommonResponseDto> {
    const user = await this.userRepository.findByEmail(command.dto.email)
    if (!user) {
      throw new NotFoundException(
        plainToInstance(CommonResponseDto, {
          message: "Email not found.",
        }),
      )
    }

    await this.passwordResetService.verifyEmail(user.email)

    return plainToInstance(CommonResponseDto, {
      message: "A verification code has send to the email. Please check your inbox.",
    })
  }
}
