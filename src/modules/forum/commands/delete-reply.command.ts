import { Command } from "@nestjs/cqrs"
import { DeleteReplyResponseDto } from "../dtos/delete-reply-response.dto"
import { ReplyResponse } from "../services/reply.service"

export class DeleteReplyCommand extends Command<ReplyResponse<DeleteReplyResponseDto>> {
  public constructor(
    public readonly userId: string,
    public readonly replyId: string,
  ) {
    super()
  }
}
