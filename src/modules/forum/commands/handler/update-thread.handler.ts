import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { UpdateThreadCommand } from "../update-thread.command"
import { ThreadService } from "../../services/thread.service"
import { ThreadResponseDto } from "../../dtos/threads/thread-response.dto"

@CommandHandler(UpdateThreadCommand)
export class UpdateThreadHandler implements ICommandHandler<UpdateThreadCommand> {
  public constructor(private readonly threadService: ThreadService) {}

  public async execute(command: UpdateThreadCommand): Promise<ThreadResponseDto> {
    return await this.threadService.update(command.userId, command.threadId, command.dto)
  }
}
