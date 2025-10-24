import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { UpdateReplyCommand } from "../update-reply.command"
import { ReplyService } from "../../services/reply.service"
import { ReplyResponseDto } from "../../dtos/replies/reply-response.dto"

@CommandHandler(UpdateReplyCommand)
export class UpdateReplyHandler implements ICommandHandler<UpdateReplyCommand> {
  public constructor(private readonly replyService: ReplyService) {}

  public async execute(command: UpdateReplyCommand): Promise<ReplyResponseDto> {
    return await this.replyService.update(command.userId, command.replyId, command.dto)
  }
}
