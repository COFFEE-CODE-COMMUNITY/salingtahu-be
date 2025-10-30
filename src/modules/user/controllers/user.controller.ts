import { Body, Controller, Get, Patch, Put, Req, Param, Post } from "@nestjs/common"
import { UserDto } from "../dto/user.dto"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiUnauthorizedResponse,
  ApiUnsupportedMediaTypeResponse,
} from "@nestjs/swagger"
import { UpdateUserDto } from "../dto/update-user.dto"
import { UserPublicDto } from "../dto/user-public.dto"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { UpdateProfilePictureCommand } from "../commands/update-profile-picture.command"
import { Request } from "express"
import { UserId } from "../../../common/http/user-id.decorator"
import { Authorized } from "../../../common/guards/bearer-token.guard"
import { GetCurrentUserQuery } from "../queries/get-current-user.query"
import { GetUserQuery } from "../queries/get-user.query"
import { ALLOWED_IMAGE_MIMETYPES } from "../../../constants/mimetype.constant"
import { UpdateUserCommand } from "../commands/update-user.command"
import { ApplyAsInstructorCommand } from "../commands/apply-as-instructor.command"
import { ApplyAsInstructorResponseDto } from "../dto/apply-as-instructor-response.dto"

@Controller("users")
export class UserController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get current user profile",
    description:
      "Retrieves the authenticated user's profile information including personal details, social media links, and account status",
  })
  @ApiOkResponse({
    type: UserDto,
    description: "Successfully retrieved user profile",
  })
  @ApiUnauthorizedResponse({
    type: CommonResponseDto,
    description: "User is not authenticated or token is invalid",
  })
  @Authorized()
  public async getMe(@UserId() userId: string): Promise<UserDto> {
    return this.queryBus.execute(new GetCurrentUserQuery(userId))
  }

  @Get(":userId")
  @ApiOperation({
    summary: "Get public user profile by ID",
    description:
      "Retrieves the public profile information of a user by their unique identifier, including personal details, social media links, and professional headline",
  })
  @ApiOkResponse({
    type: UserPublicDto,
    description: "Successfully retrieved public user profile",
  })
  @ApiNotFoundResponse({
    type: CommonResponseDto,
    description: "User not found.",
  })
  public async getUserById(@Param("userId") userId: string): Promise<UserPublicDto> {
    return this.queryBus.execute(new GetUserQuery(userId))
  }

  @Post("me/apply-as-instructor")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Apply as an instructor." })
  @ApiOkResponse({
    description: "Instructor applied successfully.",
    type: ApplyAsInstructorResponseDto,
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
  public async applyAsInstructor(@UserId() userId: string): Promise<ApplyAsInstructorResponseDto> {
    return this.commandBus.execute(new ApplyAsInstructorCommand(userId))
  }

  @Patch("me")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update current user profile",
    description:
      "Allows the authenticated user to update their profile information such as name, biography, social media links, and preferences",
  })
  @ApiOkResponse({
    type: UserDto,
    description: "Successfully updated user profile",
  })
  @ApiUnauthorizedResponse({
    type: CommonResponseDto,
    description: "User is not authenticated or token is invalid",
  })
  @Authorized()
  public async updateMe(@Body() dto: UpdateUserDto, @UserId() userId: string): Promise<UserDto> {
    return this.commandBus.execute(new UpdateUserCommand(userId, dto))
  }

  @Put("me/profile-picture")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update current user profile picture",
    description: "Allows the authenticated user to update their profile picture by providing a new image URL",
  })
  @ApiOkResponse({
    type: CommonResponseDto,
    description: "Successfully updated profile picture",
  })
  @ApiUnauthorizedResponse({
    type: CommonResponseDto,
    description: "User is not authenticated or token is invalid",
  })
  @ApiPayloadTooLargeResponse({
    type: CommonResponseDto,
    description: "Uploaded file exceeds the maximum allowed size",
  })
  @ApiUnsupportedMediaTypeResponse({
    type: CommonResponseDto,
    description: `Uploaded file has an unsupported media type. Allowed types: ${ALLOWED_IMAGE_MIMETYPES.join(", ")}`,
  })
  @ApiConsumes(...ALLOWED_IMAGE_MIMETYPES)
  @Authorized()
  public async updateProfilePicture(@Req() request: Request, @UserId() userId: string): Promise<CommonResponseDto> {
    return this.commandBus.execute(new UpdateProfilePictureCommand(userId, request))
  }
}
