import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetAllThreadByKeyQuery } from "../get-all-thread-by-key.query"
import { ThreadService } from "../../services/thread.service"
import { GetAllThreadByKeyResponseDto } from "../../dtos/threads/get-all-thread-by-key-response.dto"

@QueryHandler(GetAllThreadByKeyQuery)
export class GetAllThreadByKeyHandler implements IQueryHandler<GetAllThreadByKeyQuery> {
  public constructor(private readonly threadService: ThreadService) {}

  public async execute(command: GetAllThreadByKeyQuery): Promise<GetAllThreadByKeyResponseDto> {
    return await this.threadService.getAllThreadByKey(
      command.searchKey,
      command.page,
      command.limit,
      command.category,
      command.sort,
    )
  }
}
