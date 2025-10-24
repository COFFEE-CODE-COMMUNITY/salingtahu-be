import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { CreateReplyCommand } from "../create-reply.command"
import { CreateReplyResponseDto } from "../../dtos/replies/create-reply-response.dto"
import { ReplyService, ReplyResponse } from "../../services/reply.service"

@CommandHandler(CreateReplyCommand)
export class CreateReplyHandler implements ICommandHandler<CreateReplyCommand> {
  public constructor(private readonly replyService: ReplyService) {}

  public async execute(command: CreateReplyCommand): Promise<ReplyResponse<CreateReplyResponseDto>> {
    return await this.replyService.create(command.userId, command.dto)
  }
}
