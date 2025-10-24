import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { GetAllThreadByUserIdCommand } from "../get-all-thread-by-user-id.command"
import { ThreadService } from "../../services/thread.service"
import { GetAllThreadByUserIdResponseDto } from "../../dtos/threads/get-all-thread-by-user-id-response.dto"

@CommandHandler(GetAllThreadByUserIdCommand)
export class GetAllThreadByUserIdHandler implements ICommandHandler<GetAllThreadByUserIdCommand> {
  public constructor(private readonly threadService: ThreadService) {}

  public async execute(command: GetAllThreadByUserIdCommand): Promise<GetAllThreadByUserIdResponseDto> {
    return await this.threadService.getAllThreadsByUserId(
      command.userId,
      command.page,
      command.limit,
      command.category,
      command.sort,
    )
  }
}
