import { Body, Controller, Post } from "@nestjs/common"
import { RegisterDto } from "../dto/register.dto"
import { ApiOperation, ApiResponse, ApiTags, ApiBadRequestResponse, ApiCreatedResponse } from "@nestjs/swagger"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"
import { RegisterBadRequestResponseDto } from "../dto/register-bad-request-response.dto"

@ApiTags('Authentication')
@Controller("auth")
export class AuthController {
  @Post("register")
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account with the provided username, email, and password',
  })
  @ApiCreatedResponse({
    description: 'User successfully registered',
    type: CommonResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: RegisterBadRequestResponseDto
  })
  public async register(@Body() body: RegisterDto) {

  }
}