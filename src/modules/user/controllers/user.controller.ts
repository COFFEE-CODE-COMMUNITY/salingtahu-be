import { Body, Controller, Get, Patch, Put } from "@nestjs/common"
import { UserDto } from "../dto/user.dto"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger"
import { UpdateUserDto } from "../dto/update-user.dto"
import { UserPublicDto } from "../dto/user-public.dto"

@Controller("users")
export class UserController {
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
  public async getUserById(): Promise<UserPublicDto> {
    return new UserPublicDto()
  }

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
  public async getMe(): Promise<UserDto> {
    return new UserDto()
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
  public async updateMe(@Body() dto: UpdateUserDto): Promise<UserDto> {
    return new UserDto()
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
  @ApiConsumes("image/*")
  public async updateProfilePicture(): Promise<CommonResponseDto> {
    return new CommonResponseDto()
  }
}
