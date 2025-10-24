import { GetAllChildrenReplyQuery } from "../get-all-children-reply.query"
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { ReplyService } from "../../services/reply.service"
import { GetAllChildrenReplyResponseDto } from "../../dtos/replies/get-all-children-reply-response.dto"

@QueryHandler(GetAllChildrenReplyQuery)
export class GetAllChildrenReplyHandler implements IQueryHandler<GetAllChildrenReplyQuery> {
  public constructor(private readonly replyService: ReplyService) {}

  public async execute(command: GetAllChildrenReplyQuery): Promise<GetAllChildrenReplyResponseDto> {
    return await this.replyService.getAllChildrenReply(command.parentReplyId, command.page, command.limit, command.sort)
  }
}
