import { Command } from "@nestjs/cqrs"
import { UpdateReplyDto } from "../dtos/replies/update-reply.dto"
import { ReplyResponseDto } from "../dtos/replies/reply-response.dto"

export class UpdateReplyCommand extends Command<ReplyResponseDto> {
  public constructor(
    public readonly userId: string,
    public readonly replyId: string,
    public readonly dto: UpdateReplyDto,
  ) {
    super()
  }
}
