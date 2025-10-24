import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { DeleteReplyCommand } from "../delete-reply.command"
import { DeleteReplyResponseDto } from "../../dtos/replies/delete-reply-response.dto"
import { ReplyResponse, ReplyService } from "../../services/reply.service"

@CommandHandler(DeleteReplyCommand)
export class DeleteReplyHandler implements ICommandHandler<DeleteReplyCommand> {
  public constructor(private readonly replyService: ReplyService) {}

  public async execute(command: DeleteReplyCommand): Promise<ReplyResponse<DeleteReplyResponseDto>> {
    return await this.replyService.delete(command.userId, command.replyId)
  }
}
