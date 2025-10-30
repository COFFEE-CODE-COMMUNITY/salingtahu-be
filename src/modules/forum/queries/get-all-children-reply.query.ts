import { Query } from "@nestjs/cqrs"
import { GetAllChildrenReplyResponseDto } from "../dtos/replies/get-all-children-reply-response.dto"

export class GetAllChildrenReplyQuery extends Query<GetAllChildrenReplyResponseDto> {
  public constructor(
    public readonly parentReplyId: string,
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly sort: "latest" | "oldest" = "oldest",
  ) {
    super()
  }
}
