import { Controller, Get, Patch, Post } from "@nestjs/common"
import { CommandBus } from "@nestjs/cqrs"
import { ApiOperation, ApiOkResponse, ApiBadRequestResponse, ApiConflictResponse } from "@nestjs/swagger"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"
import { ApplyAsInstructorCommand } from "../commands/apply-as-instructor.command"
import { UserId } from "../../../common/http/user-id.decorator"

@Controller("instructors")
export class InstructorController {
  public constructor(private readonly commandBus: CommandBus) {}

  @Post("me/apply")
  @ApiOperation({ summary: "Apply as an instructor." })
  @ApiOkResponse({
    description: "Instructor applied successfully.",
    type: CommonResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Instructor application failed due to incomplete user data.",
    type: CommonResponseDto,
  })
  @ApiConflictResponse({
    description: "User has become an instructor.",
    type: CommonResponseDto,
  })
  public async applyAsInstructor(@UserId() userId: string): Promise<CommonResponseDto> {
    return this.commandBus.execute(new ApplyAsInstructorCommand(userId))
  }

  @Post("me/verification")
  public async verifyInstructor(): Promise<void> {}

  @Get("me")
  public async getCurrentInstructor(): Promise<void> {}

  @Patch("me")
  public async updateCurrentInstructor(): Promise<void> {}
}
