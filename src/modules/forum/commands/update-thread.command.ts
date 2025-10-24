import { Command } from "@nestjs/cqrs"
import { ThreadResponse } from "../services/thread.service"
import { UpdateThreadResponseDto } from "../dtos/threads/update-thread-response.dto"
import { UpdateThreadDto } from "../dtos/threads/update-thread.dto"

export class UpdateThreadCommand extends Command<ThreadResponse<UpdateThreadResponseDto>> {
  public constructor(
    public readonly userId: string,
    public readonly threadId: string,
    public readonly dto: UpdateThreadDto,
  ) {
    super()
  }
}
