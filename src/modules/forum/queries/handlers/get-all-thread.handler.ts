import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetAllThreadQuery } from "../get-all-thread.query"
import { ThreadService } from "../../services/thread.service"
import { GetAllThreadResponseDto } from "../../dtos/threads/get-all-thread-response.dto"

@QueryHandler(GetAllThreadQuery)
export class GetAllThreadHandler implements IQueryHandler<GetAllThreadQuery> {
  public constructor(private readonly threadService: ThreadService) {}

  public async execute(command: GetAllThreadQuery): Promise<GetAllThreadResponseDto> {
    return await this.threadService.getAllThreads(command.page, command.limit, command.category, command.sort)
  }
}
