import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { GetAllThreadCommand } from "../get-all-thread.command"
import { ThreadService } from "../../services/thread.service"
import { GetAllThreadResponseDto } from "../../dtos/threads/get-all-thread-response.dto"

@CommandHandler(GetAllThreadCommand)
export class GetAllThreadHandler implements ICommandHandler<GetAllThreadCommand> {
  public constructor(private readonly threadService: ThreadService) {}

  public async execute(command: GetAllThreadCommand): Promise<GetAllThreadResponseDto> {
    return await this.threadService.getAllThreads(command.page, command.limit, command.category, command.sort)
  }
}
