import { Body, Controller, Post, HttpCode, HttpStatus, Headers, Get, Query, Res, } from "@nestjs/common"
import { RegisterDto } from "../dto/register.dto"
import { ApiOperation, ApiResponse, ApiTags, ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiUnauthorizedResponse, ApiQuery } from "@nestjs/swagger"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"
import { RegisterBadRequestResponseDto } from "../dto/register-bad-request-response.dto"
import { LoginDto } from "../dto/login.dto"
import { TokensDto } from "../dto/token.dto"
import { GetRefreshTokenDto } from "../dto/get-refresh-token.dto"
import { PasswordResetBadRequestDto } from "../dto/password-reset-bad-request.dto"
import { GoogleAuthResponseDto } from "../dto/google-auth-response.dto"

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

  @Post("login")
  @ApiOperation({
    summary: 'Login user',
    description: 'Login user account with the provided email and password'
  })
  @ApiOkResponse({
    description: 'User successfully login',
    type: CommonResponseDto
  })
  @ApiUnauthorizedResponse({
    description: 'User unauthorized.',
    type: CommonResponseDto
  })
  public async login(@Body() body: LoginDto) {

  }

  @Get("refresh-token")
  @ApiOperation({
    summary: 'Refresh token.',
    description: 'This endpoint refreshes the access token using the refresh token.'
  })
  @ApiOkResponse({
    type: TokensDto,
    description: "The access token has been refreshed successfully.",
  })
  @ApiUnauthorizedResponse({
    type: CommonResponseDto,
    description: "The user is not authorized to perform this action.",
  })
  @HttpCode(HttpStatus.OK)
  public async refreshToken(
    @Body() body: GetRefreshTokenDto,
    @Headers('User-Agent') userAgent: string,
  ) {

  }

  @Post("/password-reset")
  @ApiOperation({
    summary: "Request password reset",
    description: "This endpoint sends a password reset email to the user.",
  })
  @ApiOkResponse({
    type: CommonResponseDto,
    description: "The password reset email has been sent successfully.",
  })
  @ApiBadRequestResponse({
    type: PasswordResetBadRequestDto,
    description: "The request body is invalid.",
  })
  public async passwordReset(): Promise<CommonResponseDto> {
    return new CommonResponseDto()
  }

  @Post("/password-reset/change")
  @ApiOperation({
    summary: "Request change password",
    description: "This endpoint change a password reset to the user.",
  })
  @ApiOkResponse({
    type: CommonResponseDto,
    description: "The change password email has been sent successfully.",
  })
  @ApiBadRequestResponse({
    type: PasswordResetBadRequestDto,
    description: "The request body is invalid.",
  })
  public async changePassword(): Promise<CommonResponseDto> {
    return new CommonResponseDto()
  }

  @Get("/google")
  @ApiOperation({
    summary: "Get Google OAuth2 URL",
    description: "This endpoint returns the Google OAuth2 URL for authentication.",
  })
  @ApiQuery({
    name: 'platform',
    description: 'The platform for which to retrieve the Google OAuth2 URL.',
    required: true,
  })
  @ApiOkResponse({
    type: GoogleAuthResponseDto,
    description: "The Google OAuth2 URL has been retrieved successfully.",
  })
  public async googleAuth(): Promise<GoogleAuthResponseDto> {
    return new GoogleAuthResponseDto
  }

  @Get("/google/callback")
  @ApiOperation({
    summary: "Handle Google authentication redirect",
    description: "This endpoint handles the redirect from Google after the user has authenticated.",
  })
  public async googleAuthCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Headers('User-Agent') userAgent: string,
    @Res() res: Response
  ): Promise<void> {
  }
}