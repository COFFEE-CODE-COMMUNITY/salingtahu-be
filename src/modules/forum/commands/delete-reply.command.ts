import { Command } from "@nestjs/cqrs"
import { ReplyResponseDto } from "../dtos/replies/reply-response.dto"

export class DeleteReplyCommand extends Command<ReplyResponseDto> {
  public constructor(
    public readonly userId: string,
    public readonly replyId: string,
  ) {
    super()
  }
}
