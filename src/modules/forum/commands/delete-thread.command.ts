import { Command } from "@nestjs/cqrs"
import { ThreadResponse } from "../services/thread.service"
import { DeleteThreadResponseDto } from "../dtos/delete-thread-response.dto"

export class DeleteThreadCommand extends Command<ThreadResponse<DeleteThreadResponseDto>> {
  public constructor(
    public readonly userId: string,
    public readonly threadId: string,
  ) {
    super()
  }
}
