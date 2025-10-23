import { Command } from "@nestjs/cqrs"
import { CreateReplyDto } from "../dtos/create-reply.dto"
import { CreateReplyResponseDto } from "../dtos/create-reply-response.dto"
import { ReplyResponse } from "../services/reply.service"

export class CreateReplyCommand extends Command<ReplyResponse<CreateReplyResponseDto>> {
  public constructor(
    public readonly userId: string,
    public readonly dto: CreateReplyDto,
  ) {
    super()
  }
}
