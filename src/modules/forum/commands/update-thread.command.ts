import { Command } from "@nestjs/cqrs"
import { UpdateThreadDto } from "../dtos/threads/update-thread.dto"
import { ThreadResponseDto } from "../dtos/threads/thread-response.dto"

export class UpdateThreadCommand extends Command<ThreadResponseDto> {
  public constructor(
    public readonly userId: string,
    public readonly threadId: string,
    public readonly dto: UpdateThreadDto,
  ) {
    super()
  }
}
