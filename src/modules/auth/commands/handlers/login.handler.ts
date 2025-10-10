import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs"
import { LoginCommand } from "../login.command"
import { CommonResponseDto } from "../../../../common/dto/common-response.dto"
import { TokensDto } from "../../dto/tokens.dto"
import { UserRepository } from "../../../user/repositories/user.repository"
import { AccessTokenService } from "../../services/access-token.service"
import { RefreshTokenService } from "../../services/refresh-token.service"
import { PasswordService } from "../../services/password.service"
import { UnauthorizedException, UnprocessableEntityException } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { UserLoggedInEvent } from "../../events/user-logged-in.event"
import _ from "lodash"

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  public constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly passwordService: PasswordService,
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  public async execute({ dto, userAgent, ipAddress }: LoginCommand): Promise<TokensDto> {
    const user = await this.userRepository.findByEmail(dto.email)

    if (!user) {
      throw new UnauthorizedException(
        plainToInstance(CommonResponseDto, {
          message: "Invalid credentials.",
        }),
      )
    }

    if (user.password) {
      const isValid = await this.passwordService.compare(dto.password, user.password)

      if (!isValid) {
        throw new UnauthorizedException(
          plainToInstance(CommonResponseDto, {
            message: "Invalid credentials.",
          }),
        )
      }
    } else {
      throw new UnprocessableEntityException(
        plainToInstance(CommonResponseDto, {
          message: `Please logged in using ${user.oauth2Users.map(oauth2User => _.startCase(oauth2User.provider.toLowerCase())).join(", ")}.`,
        }),
      )
    }

    const refreshToken = await this.refreshTokenService.create(user, userAgent, ipAddress)
    const accessToken = await this.accessTokenService.sign(user.id)

    this.eventBus.publish(new UserLoggedInEvent(user))

    return plainToInstance(TokensDto, {
      accessToken,
      refreshToken: refreshToken.token,
    })
  }
}
