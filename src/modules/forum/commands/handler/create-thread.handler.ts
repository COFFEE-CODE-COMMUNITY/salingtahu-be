import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { CreateThreadCommand } from "../create-thread.command"
import { ThreadResponseDto } from "../../dtos/threads/thread-response.dto"
import { ThreadService } from "../../services/thread.service"

@CommandHandler(CreateThreadCommand)
export class CreateThreadHandler implements ICommandHandler<CreateThreadCommand> {
  public constructor(private readonly threadService: ThreadService) {}

  public async execute(command: CreateThreadCommand): Promise<ThreadResponseDto> {
    return await this.threadService.create(command.userId, command.dto)
  }
}
