import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { CreateThreadCommand } from "../create-thread.command"
import { CreateThreadResponseDto } from "../../dtos/create-thread-response.dto"

@CommandHandler(CreateThreadCommand)
export class CreateThreadHandler implements ICommandHandler<CreateThreadCommand> {
  // public constructor() {}

  public async execute(command: CreateThreadCommand): Promise<CreateThreadResponseDto> {
    return new CreateThreadResponseDto()
  }
}
