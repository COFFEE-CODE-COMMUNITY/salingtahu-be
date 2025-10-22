import { Command } from "@nestjs/cqrs"
import { CreateThreadDto } from "../dtos/create-thread.dto"
import { CreateThreadResponseDto } from "../dtos/create-thread-response.dto"

export class CreateThreadCommand extends Command<CreateThreadResponseDto> {
  public constructor(
    public userId: string,
    public dto: CreateThreadDto,
  ) {
    super()
  }
}
