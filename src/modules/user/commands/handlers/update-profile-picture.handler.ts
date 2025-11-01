import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { UpdateProfilePictureCommand } from "../update-profile-picture.command"
import { CommonResponseDto } from "../../../../dto/common-response.dto"
import { plainToInstance } from "class-transformer"
import { UserService } from "../../services/user.service"

@CommandHandler(UpdateProfilePictureCommand)
export class UpdateProfilePictureHandler implements ICommandHandler<UpdateProfilePictureCommand> {
  public constructor(private readonly userService: UserService) {}

  public async execute(command: UpdateProfilePictureCommand): Promise<CommonResponseDto> {
    await this.userService.saveProfilePicture(command.userId, command.fileStream)

    return plainToInstance(CommonResponseDto, {
      message: "Profile picture updated successfully."
    })
  }
}
