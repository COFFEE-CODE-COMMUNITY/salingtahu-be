import { Command } from "@nestjs/cqrs"
import { ReplyResponse } from "../services/reply.service"
import { UpdateReplyResponseDto } from "../dtos/replies/update-reply-response.dto"
import { UpdateReplyDto } from "../dtos/replies/update-reply.dto"

export class UpdateReplyCommand extends Command<ReplyResponse<UpdateReplyResponseDto>> {
  public constructor(
    public readonly userId: string,
    public readonly replyId: string,
    public readonly dto: UpdateReplyDto,
  ) {
    super()
  }
}
