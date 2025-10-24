import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { CreateThreadCommand } from "../create-thread.command"
import { CreateThreadResponseDto } from "../../dtos/threads/create-thread-response.dto"
import { ThreadResponse, ThreadService } from "../../services/thread.service"

@CommandHandler(CreateThreadCommand)
export class CreateThreadHandler implements ICommandHandler<CreateThreadCommand> {
  public constructor(private readonly threadService: ThreadService) {}

  public async execute(command: CreateThreadCommand): Promise<ThreadResponse<CreateThreadResponseDto>> {
    return await this.threadService.create(command.userId, command.dto)
  }
}
