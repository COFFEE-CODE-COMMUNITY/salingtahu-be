import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetAllReplyQuery } from "../get-all-reply.query"
import { ReplyService } from "../../services/reply.service"
import { GetAllReplyByThreadResponseDto } from "../../dtos/replies/get-all-reply-by-thread-id-response.dto"

@QueryHandler(GetAllReplyQuery)
export class GetAllReplyHandler implements IQueryHandler<GetAllReplyQuery> {
  public constructor(private readonly replyService: ReplyService) {}

  public async execute(command: GetAllReplyQuery): Promise<GetAllReplyByThreadResponseDto> {
    return await this.replyService.getAllReplyByThreadId(command.threadId, command.page, command.limit, command.sort)
  }
}
