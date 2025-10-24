import { Command } from "@nestjs/cqrs"
import { CreateThreadDto } from "../dtos/threads/create-thread.dto"
import { CreateThreadResponseDto } from "../dtos/threads/create-thread-response.dto"
import { ThreadResponse } from "../services/thread.service"

export class CreateThreadCommand extends Command<ThreadResponse<CreateThreadResponseDto>> {
  public constructor(
    public userId: string,
    public dto: CreateThreadDto,
  ) {
    super()
  }
}
