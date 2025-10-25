import { Command } from "@nestjs/cqrs"
import { CreateThreadDto } from "../dtos/threads/create-thread.dto"
import { ThreadResponseDto } from "../dtos/threads/thread-response.dto"

export class CreateThreadCommand extends Command<ThreadResponseDto> {
  public constructor(
    public userId: string,
    public dto: CreateThreadDto,
  ) {
    super()
  }
}
