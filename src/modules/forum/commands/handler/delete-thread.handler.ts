import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { DeleteThreadCommand } from "../delete-thread.command"
import { ThreadService } from "../../services/thread.service"
import { CommonResponseDto } from "../../../../common/dto/common-response.dto"
import { plainToInstance } from "class-transformer"

@CommandHandler(DeleteThreadCommand)
export class DeleteThreadHandler implements ICommandHandler<DeleteThreadCommand> {
  public constructor(private readonly threadService: ThreadService) {}

  public async execute(command: DeleteThreadCommand): Promise<CommonResponseDto> {
    await this.threadService.delete(command.userId, command.threadId)

    return plainToInstance(CommonResponseDto, {
      message: "Thread successfully deleted",
    })
  }
}
