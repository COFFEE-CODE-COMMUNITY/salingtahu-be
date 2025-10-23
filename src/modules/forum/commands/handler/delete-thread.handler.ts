import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { DeleteThreadCommand } from "../delete-thread.command"
import { ThreadResponse, ThreadService } from "../../services/thread.service"
import { DeleteThreadResponseDto } from "../../dtos/delete-thread-response.dto"

@CommandHandler(DeleteThreadCommand)
export class DeleteThreadHandler implements ICommandHandler<DeleteThreadCommand> {
  public constructor(private readonly threadService: ThreadService) {}

  public async execute(command: DeleteThreadCommand): Promise<ThreadResponse<DeleteThreadResponseDto>> {
    return await this.threadService.delete(command.userId, command.threadId)
  }
}
