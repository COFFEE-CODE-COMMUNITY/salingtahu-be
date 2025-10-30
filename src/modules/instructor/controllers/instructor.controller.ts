import { Controller, Get, Patch, Post } from "@nestjs/common"
import { CommandBus } from "@nestjs/cqrs"
import {
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiBearerAuth,
} from "@nestjs/swagger"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"
import { ApplyAsInstructorCommand } from "../commands/apply-as-instructor.command"
import { UserId } from "../../../common/http/user-id.decorator"
import { VerifyInstructorResponseDto } from "../dto/apply-as-instructor-response.dto"
import { VerifyInstructorCommand } from "../commands/verify-instructor.command"
import { Roles } from "../../../common/guards/roles.guard"
import { UserRole } from "../../user/enums/user-role.enum"
import { Authorized } from "../../../common/guards/bearer-token.guard"

@Controller("instructors")
export class InstructorController {
  public constructor(private readonly commandBus: CommandBus) {}

  @Post("me/apply")
  @ApiBearerAuth()
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
  @Authorized()
  public async applyAsInstructor(@UserId() userId: string): Promise<CommonResponseDto> {
    return this.commandBus.execute(new ApplyAsInstructorCommand(userId))
  }

  @Get("me/verification")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Verify instructor." })
  @ApiOkResponse({
    type: VerifyInstructorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: "User is not an instructor or unauthorized user.",
    type: CommonResponseDto,
  })
  @Roles([UserRole.INSTRUCTOR])
  public async verifyInstructor(@UserId() userId: string): Promise<VerifyInstructorResponseDto> {
    return this.commandBus.execute(new VerifyInstructorCommand(userId))
  }

  @Get("me")
  public async getCurrentInstructor(): Promise<void> {}

  @Patch("me")
  public async updateCurrentInstructor(): Promise<void> {}
}
