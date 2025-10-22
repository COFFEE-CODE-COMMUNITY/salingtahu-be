import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger"
import { Body, Controller, Post } from "@nestjs/common"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"
import { RegisterBadRequestResponseDto } from "../../auth/dtos/register-bad-request-response.dto"
import { CommandBus } from "@nestjs/cqrs"
import { CreateThreadDto } from "../dtos/create-thread.dto"
import { CreateThreadCommand } from "../commands/create-thread.command"
import { CreateThreadResponseDto } from "../dtos/create-thread-response.dto"

@ApiTags("Forums")
@Controller("forum")
export class ForumController {
  public constructor(private readonly commandBus: CommandBus) {}

  @Post("thread")
  @ApiOperation({
    summary: "Create new thread.",
    description: "Creates a new thread with the provided title, and content.",
  })
  @ApiCreatedResponse({
    description: "Thread successfully created",
    type: CommonResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data",
    type: RegisterBadRequestResponseDto,
  })
  public async createThread(
    userId: string,
    @Body() dto: CreateThreadDto
  ): Promise<CreateThreadResponseDto> {
    return this.commandBus.execute(new CreateThreadCommand(userId, dto))
  }
}
