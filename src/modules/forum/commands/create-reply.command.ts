import { Command } from "@nestjs/cqrs"
import { CreateReplyDto } from "../dtos/replies/create-reply.dto"
import { ReplyResponseDto } from "../dtos/replies/reply-response.dto"

export class CreateReplyCommand extends Command<ReplyResponseDto> {
  public constructor(
    public readonly userId: string,
    public readonly dto: CreateReplyDto,
  ) {
    super()
  }
}
