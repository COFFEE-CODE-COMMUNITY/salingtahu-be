import { Command } from "@nestjs/cqrs"
import { GetAllReplyByThreadResponseDto } from "../dtos/replies/get-all-reply-by-thread-id-response.dto"

export class GetAllReplyCommand extends Command<GetAllReplyByThreadResponseDto> {
  public constructor(
    public readonly threadId: string,
    public readonly page: number,
    public readonly limit: number,
    public readonly sort: "latest" | "oldest" = "latest",
  ) {
    super()
  }
}
