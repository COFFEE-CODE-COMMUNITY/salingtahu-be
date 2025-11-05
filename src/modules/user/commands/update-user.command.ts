import { Command } from "@nestjs/cqrs"
import { UserDto } from "../dto/user.dto"

export class UpdateUserCommand extends Command<UserDto> {
  public constructor(
    public readonly userId: string,
    public readonly dto: UserDto
  ) {
    super()
  }
}
