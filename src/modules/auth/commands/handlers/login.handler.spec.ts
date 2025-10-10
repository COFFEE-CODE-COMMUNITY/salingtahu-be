import { mock, MockProxy } from "jest-mock-extended"
import { LoginHandler } from "./login.handler"
import { AccessTokenService } from "../../services/access-token.service"
import { RefreshTokenService } from "../../services/refresh-token.service"
import { PasswordService } from "../../services/password.service"
import { UserRepository } from "../../../user/repositories/user.repository"
import { EventBus } from "@nestjs/cqrs"
import { Test } from "@nestjs/testing"
import { User } from "../../../user/entities/user.entity"
import { faker } from "@faker-js/faker"
import { RefreshToken } from "../../entities/refresh-token.entity"
import { LoginDto } from "../../dtos/login.dto"
import { LoginCommand } from "../login.command"
import { UserLoggedInEvent } from "../../events/user-logged-in.event"
import { OAuth2Provider } from "../../enums/oauth2-provider.enum"
import { UnauthorizedException, UnprocessableEntityException } from "@nestjs/common"
import { OAuth2User } from "../../entities/oauth2-user.entity"

describe("LoginHandler", () => {
  let handler: LoginHandler
  let accessTokenService: MockProxy<AccessTokenService>
  let refreshTokenService: MockProxy<RefreshTokenService>
  let passwordService: MockProxy<PasswordService>
  let userRepository: MockProxy<UserRepository>
  let eventBus: MockProxy<EventBus>

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LoginHandler,
        {
          provide: AccessTokenService,
          useValue: mock<AccessTokenService>(),
        },
        {
          provide: RefreshTokenService,
          useValue: mock<RefreshTokenService>(),
        },
        {
          provide: PasswordService,
          useValue: mock<PasswordService>(),
        },
        {
          provide: UserRepository,
          useValue: mock<UserRepository>(),
        },
        {
          provide: EventBus,
          useValue: mock<EventBus>(),
        },
      ],
    }).compile()

    handler = module.get(LoginHandler)
    accessTokenService = module.get(AccessTokenService)
    refreshTokenService = module.get(RefreshTokenService)
    passwordService = module.get(PasswordService)
    userRepository = module.get(UserRepository)
    eventBus = module.get(EventBus)
  })

  it("should be defined", () => {
    expect(handler).toBeDefined()
    expect(accessTokenService).toBeDefined()
    expect(refreshTokenService).toBeDefined()
    expect(passwordService).toBeDefined()
    expect(userRepository).toBeDefined()
    expect(eventBus).toBeDefined()
  })

  describe("handle", () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it("should handle login successfully", async () => {
      // Arrange
      const user = new User()
      user.id = faker.string.uuid()
      user.password = faker.internet.password()

      userRepository.findByEmail.mockResolvedValue(user)

      passwordService.compare.mockResolvedValue(true)

      const refreshToken = new RefreshToken()
      refreshToken.token = faker.string.alphanumeric(128)
      refreshTokenService.create.mockResolvedValue(refreshToken)

      const accessToken = faker.string.alphanumeric(128)
      accessTokenService.sign.mockResolvedValue(accessToken)

      const dto = new LoginDto()
      dto.email = user.email
      dto.password = user.password
      const userAgent = faker.internet.userAgent()
      const ipAddress = faker.internet.ip()

      // Act
      const result = await handler.execute(new LoginCommand(dto, userAgent, ipAddress))

      // Assert
      expect(result).toBeDefined()
      expect(result.accessToken).toBe(accessToken)
      expect(result.refreshToken).toBe(refreshToken.token)
      expect(userRepository.findByEmail).toHaveBeenCalledWith(dto.email)
      expect(passwordService.compare).toHaveBeenCalledWith(dto.password, user.password)
      expect(refreshTokenService.create).toHaveBeenCalledWith(user, userAgent, ipAddress)
      expect(accessTokenService.sign).toHaveBeenCalledWith(user.id)
      expect(eventBus.publish).toHaveBeenCalledWith(expect.any(UserLoggedInEvent))
    })

    it("should throw UnauthorizedException if user not found", async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue(null)

      const dto = new LoginDto()
      dto.email = faker.internet.email()
      dto.password = faker.internet.password()
      const userAgent = faker.internet.userAgent()
      const ipAddress = faker.internet.ip()

      // Act & Assert
      await expect(handler.execute(new LoginCommand(dto, userAgent, ipAddress))).rejects.toThrow(UnauthorizedException)
      expect(userRepository.findByEmail).toHaveBeenCalledWith(dto.email)
      expect(passwordService.compare).not.toHaveBeenCalled()
      expect(refreshTokenService.create).not.toHaveBeenCalled()
      expect(accessTokenService.sign).not.toHaveBeenCalled()
      expect(eventBus.publish).not.toHaveBeenCalled()
    })

    it("should throw UnauthorizedException if password is invalid", async () => {
      // Arrange
      const user = new User()
      user.id = faker.string.uuid()
      user.password = faker.internet.password()

      userRepository.findByEmail.mockResolvedValue(user)

      passwordService.compare.mockResolvedValue(false)

      const dto = new LoginDto()
      dto.email = user.email
      dto.password = faker.internet.password()
      const userAgent = faker.internet.userAgent()
      const ipAddress = faker.internet.ip()

      // Act & Assert
      await expect(handler.execute(new LoginCommand(dto, userAgent, ipAddress))).rejects.toThrow(UnauthorizedException)
      expect(userRepository.findByEmail).toHaveBeenCalledWith(dto.email)
      expect(passwordService.compare).toHaveBeenCalledWith(dto.password, user.password)
      expect(refreshTokenService.create).not.toHaveBeenCalled()
      expect(accessTokenService.sign).not.toHaveBeenCalled()
      expect(eventBus.publish).not.toHaveBeenCalled()
    })

    it("should throw UnprocessableEntityException if user has no password", async () => {
      // Arrange
      const user = new User()
      user.id = faker.string.uuid()
      user.oauth2Users = [
        {
          id: faker.string.uuid(),
          provider: OAuth2Provider.GOOGLE,
          providerUserId: faker.string.uuid(),
          user: user,
        } as OAuth2User,
      ]

      userRepository.findByEmail.mockResolvedValue(user)

      const dto = new LoginDto()
      dto.email = user.email
      dto.password = faker.internet.password()
      const userAgent = faker.internet.userAgent()
      const ipAddress = faker.internet.ip()

      // Act & Assert
      await expect(handler.execute(new LoginCommand(dto, userAgent, ipAddress))).rejects.toThrow(
        UnprocessableEntityException,
      )
      expect(userRepository.findByEmail).toHaveBeenCalledWith(dto.email)
      expect(passwordService.compare).not.toHaveBeenCalled()
      expect(refreshTokenService.create).not.toHaveBeenCalled()
      expect(accessTokenService.sign).not.toHaveBeenCalled()
      expect(eventBus.publish).not.toHaveBeenCalled()
    })
  })
})
