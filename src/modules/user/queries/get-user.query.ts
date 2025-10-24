import { Query } from "@nestjs/cqrs"
import { UserPublicDto } from "../dto/user-public.dto"

export class GetUserQuery extends Query<UserPublicDto> {
  public constructor(public userId: string) {
    super()
  }
}
