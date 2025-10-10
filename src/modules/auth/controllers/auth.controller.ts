import { Body, Controller, Post, HttpCode, HttpStatus, Get, Query, Res } from "@nestjs/common"
import { RegisterDto } from "../dto/register.dto"
import {
  ApiOperation,
  ApiTags,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiQuery,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"
import { RegisterBadRequestResponseDto } from "../dto/register-bad-request-response.dto"
import { LoginDto } from "../dto/login.dto"
import { TokensDto } from "../dto/tokens.dto"
import { GetRefreshTokenDto } from "../dto/get-refresh-token.dto"
import { PasswordResetBadRequestDto } from "../dto/password-reset-bad-request.dto"
import { GoogleAuthResponseDto } from "../dto/google-auth-response.dto"
import { CommandBus } from "@nestjs/cqrs"
import { RegisterCommand } from "../commands/register.command"
import { LoginCommand } from "../commands/login.command"
import { IpAddress } from "../../../common/http/ip-address.decorator"
import { Response, CookieOptions } from "express"
import { ConfigService } from "@nestjs/config"
import { NodeEnv } from "../../../common/enums/node-env"
import { REFRESH_TOKEN_COOKIE_NAME } from "../constants/cookie-name.constant"
import ms, { StringValue } from "ms"
import { RequiredHeader } from "../../../common/http/required-header.decorator"

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  public constructor(
    private readonly config: ConfigService,
    private readonly commandBus: CommandBus,
  ) {}

  @Post("register")
  @ApiOperation({
    summary: "Register a new user",
    description: "Creates a new user account with the provided username, email, and password",
  })
  @ApiCreatedResponse({
    description: "User successfully registered",
    type: CommonResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data",
    type: RegisterBadRequestResponseDto,
  })
  public async register(@Body() body: RegisterDto): Promise<CommonResponseDto> {
    return this.commandBus.execute(new RegisterCommand(body))
  }

  @Post("login")
  @ApiOperation({
    summary: "Login user",
    description: "Login user account with the provided email and password",
  })
  @ApiOkResponse({
    description: "User successfully login",
    type: CommonResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Missing required header.",
    type: CommonResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: "User unauthorized.",
    type: CommonResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: "User must login using OAuth2.",
    type: CommonResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() body: LoginDto,
    @RequiredHeader("User-Agent") userAgent: string,
    @IpAddress() ipAddress: string,
    @Res() res: Response,
  ): Promise<void> {
    const tokens = await this.commandBus.execute(new LoginCommand(body, userAgent, ipAddress))

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, this.getSetCookieOptions())
    res.status(HttpStatus.OK).json(tokens)
  }

  @Get("refresh-token")
  @ApiOperation({
    summary: "Refresh token.",
    description: "This endpoint refreshes the access token using the refresh token.",
  })
  @ApiOkResponse({
    type: TokensDto,
    description: "The access token has been refreshed successfully.",
  })
  @ApiUnauthorizedResponse({
    type: CommonResponseDto,
    description: "The user is not authorized to perform this action.",
  })
  public async refreshToken(
    @Body() _body: GetRefreshTokenDto,
    @RequiredHeader("User-Agent") _userAgent: string,
  ): Promise<TokensDto> {
    return new TokensDto()
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
    name: "platform",
    description: "The platform for which to retrieve the Google OAuth2 URL.",
    required: true,
  })
  @ApiOkResponse({
    type: GoogleAuthResponseDto,
    description: "The Google OAuth2 URL has been retrieved successfully.",
  })
  public async googleAuth(): Promise<GoogleAuthResponseDto> {
    return new GoogleAuthResponseDto()
  }

  @Get("/google/callback")
  @ApiOperation({
    summary: "Handle Google authentication redirect",
    description: "This endpoint handles the redirect from Google after the user has authenticated.",
  })
  public async googleAuthCallback(
    @Query("code") code: string,
    @Query("state") state: string,
    @RequiredHeader("User-Agent") userAgent: string,
    @Res() res: Response,
  ): Promise<void> {
    console.log(code, state, userAgent, res)
  }

  private getSetCookieOptions(): CookieOptions {
    const raw = this.config.getOrThrow<StringValue>("refreshToken.expiresIn")
    const maxAge = typeof raw === "string" ? ms(raw) : raw
    return {
      domain: this.config.get("client.web.domain", "localhost"),
      httpOnly: true,
      maxAge: maxAge,
      sameSite: this.config.get("app.nodeEnv") === NodeEnv.PRODUCTION ? "none" : "strict",
      secure: this.config.get("app.nodeEnv") === NodeEnv.PRODUCTION,
    }
  }
}
