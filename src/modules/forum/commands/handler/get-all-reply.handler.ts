import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { GetAllReplyCommand } from "../get-all-reply.command"
import { ReplyService } from "../../services/reply.service"
import { GetAllReplyByThreadResponseDto } from "../../dtos/replies/get-all-reply-by-thread-id-response.dto"

@CommandHandler(GetAllReplyCommand)
export class GetAllReplyHandler implements ICommandHandler<GetAllReplyCommand> {
  public constructor(private readonly replyService: ReplyService) {}

  public async execute(command: GetAllReplyCommand): Promise<GetAllReplyByThreadResponseDto> {
    return await this.replyService.getAllReplyByThreadId(command.threadId, command.page, command.limit, command.sort)
  }
}
