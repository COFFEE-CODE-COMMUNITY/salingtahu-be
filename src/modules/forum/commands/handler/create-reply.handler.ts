import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { CreateReplyCommand } from "../create-reply.command"
import { ReplyResponseDto } from "../../dtos/replies/reply-response.dto"
import { ReplyService } from "../../services/reply.service"

@CommandHandler(CreateReplyCommand)
export class CreateReplyHandler implements ICommandHandler<CreateReplyCommand> {
  public constructor(private readonly replyService: ReplyService) {}

  public async execute(command: CreateReplyCommand): Promise<ReplyResponseDto> {
    return await this.replyService.create(command.userId, command.dto)
  }
}
