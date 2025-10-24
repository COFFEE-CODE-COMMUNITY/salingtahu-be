import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { UpdateThreadCommand } from "../update-thread.command"
import { ThreadResponse, ThreadService } from "../../services/thread.service"
import { UpdateThreadResponseDto } from "../../dtos/threads/update-thread-response.dto"

@CommandHandler(UpdateThreadCommand)
export class UpdateThreadHandler implements ICommandHandler<UpdateThreadCommand> {
  public constructor(private readonly threadService: ThreadService) {}

  public async execute(command: UpdateThreadCommand): Promise<ThreadResponse<UpdateThreadResponseDto>> {
    return await this.threadService.update(command.userId, command.threadId, command.dto)
  }
}
