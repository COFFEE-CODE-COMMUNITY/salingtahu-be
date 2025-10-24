import { GetAllChildrenReplyCommand } from "../get-all-children-reply.command"
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { ReplyService } from "../../services/reply.service"
import { GetAllChildrenReplyResponseDto } from "../../dtos/replies/get-all-children-reply-response.dto"

@CommandHandler(GetAllChildrenReplyCommand)
export class GetAllChildrenReplyHandler implements ICommandHandler<GetAllChildrenReplyCommand> {
  public constructor(private readonly replyService: ReplyService) {}

  public async execute(command: GetAllChildrenReplyCommand): Promise<GetAllChildrenReplyResponseDto> {
    return await this.replyService.getAllChildrenReply(command.parentReplyId, command.page, command.limit, command.sort)
  }
}
