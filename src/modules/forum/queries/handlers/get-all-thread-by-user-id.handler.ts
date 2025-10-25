import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetAllThreadByUserIdQuery } from "../get-all-thread-by-user-id.query"
import { ThreadService } from "../../services/thread.service"
import { GetAllThreadByUserIdResponseDto } from "../../dtos/threads/get-all-thread-by-user-id-response.dto"

@QueryHandler(GetAllThreadByUserIdQuery)
export class GetAllThreadByUserIdHandler implements IQueryHandler<GetAllThreadByUserIdQuery> {
  public constructor(private readonly threadService: ThreadService) {}

  public async execute(command: GetAllThreadByUserIdQuery): Promise<GetAllThreadByUserIdResponseDto> {
    return await this.threadService.getAllThreadsByUserId(
      command.userId,
      command.page,
      command.limit,
      command.category,
      command.sort,
    )
  }
}
