import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { GetAllThreadByKeyCommand } from "../get-all-thread-by-key.command"
import { ThreadService } from "../../services/thread.service"
import { GetAllThreadByKeyResponseDto } from "../../dtos/threads/get-all-thread-by-key-response.dto"

@CommandHandler(GetAllThreadByKeyCommand)
export class GetAllThreadByKeyHandler implements ICommandHandler<GetAllThreadByKeyCommand> {
  public constructor(private readonly threadService: ThreadService) {}

  public async execute(command: GetAllThreadByKeyCommand): Promise<GetAllThreadByKeyResponseDto> {
    return await this.threadService.getAllThreadByKey(
      command.searchKey,
      command.page,
      command.limit,
      command.category,
      command.sort,
    )
  }
}
