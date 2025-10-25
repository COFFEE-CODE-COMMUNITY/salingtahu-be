import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { DeleteReplyCommand } from "../delete-reply.command"
import { ReplyService } from "../../services/reply.service"
import { ReplyResponseDto } from "../../dtos/replies/reply-response.dto"

@CommandHandler(DeleteReplyCommand)
export class DeleteReplyHandler implements ICommandHandler<DeleteReplyCommand> {
  public constructor(private readonly replyService: ReplyService) {}

  public async execute(command: DeleteReplyCommand): Promise<ReplyResponseDto> {
    return await this.replyService.delete(command.userId, command.replyId)
  }
}
