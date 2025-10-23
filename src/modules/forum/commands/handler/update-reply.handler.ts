import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { UpdateReplyCommand } from "../update-reply.command"
import { ReplyResponse, ReplyService } from "../../services/reply.service"
import { UpdateReplyResponseDto } from "../../dtos/update-reply-response.dto"

@CommandHandler(UpdateReplyCommand)
export class UpdateReplyHandler implements ICommandHandler<UpdateReplyCommand> {
  public constructor(private readonly replyService: ReplyService) {}

  public async execute(command: UpdateReplyCommand): Promise<ReplyResponse<UpdateReplyResponseDto>> {
    return await this.replyService.update(command.userId, command.replyId, command.dto)
  }
}
