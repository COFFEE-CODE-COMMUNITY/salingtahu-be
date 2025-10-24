import { Command } from "@nestjs/cqrs"
import { UserDto } from "../dto/user.dto"
import { UpdateUserDto } from "../dto/update-user.dto"

export class UpdateUserCommand extends Command<UserDto> {
  public constructor(
    public readonly userId: string,
    public readonly dto: UpdateUserDto,
  ) {
    super()
  }
}
