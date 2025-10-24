import { Query } from "@nestjs/cqrs"
import { UserDto } from "../dto/user.dto"

export class GetCurrentUserQuery extends Query<UserDto> {
  public constructor(public readonly userId: string) {
    super()
  }
}
