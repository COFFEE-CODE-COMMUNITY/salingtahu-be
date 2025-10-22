import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger"
import { Body, Controller, Post } from "@nestjs/common"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"
import { RegisterBadRequestResponseDto } from "../../auth/dtos/register-bad-request-response.dto"
import { RegisterDto } from "../../auth/dtos/register.dto"
import { RegisterCommand } from "../../auth/commands/register.command"
import { CommandBus } from "@nestjs/cqrs"

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
  public async createThread(@Body() body: RegisterDto): Promise<CommonResponseDto> {
    return this.commandBus.execute(new RegisterCommand(body))
  }
}
