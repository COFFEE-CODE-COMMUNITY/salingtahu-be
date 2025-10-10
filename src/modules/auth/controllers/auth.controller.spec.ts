import { Test } from "@nestjs/testing"
import { AuthController } from "./auth.controller"
import { CommandBus } from "@nestjs/cqrs"
import { mock, MockProxy } from "jest-mock-extended"
import { RegisterDto } from "../dto/register.dto"
import { faker } from "@faker-js/faker"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"
import { RegisterCommand } from "../commands/register.command"
import { LoginDto } from "../dto/login.dto"
import { TokensDto } from "../dto/tokens.dto"
import { LoginCommand } from "../commands/login.command"
import { Response } from "express"
import { HttpStatus } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { REFRESH_TOKEN_COOKIE_NAME } from "../constants/cookie-name.constant"
import { NodeEnv } from "../../../common/enums/node-env"

describe("AuthController", () => {
  let controller: AuthController
  let commandBus: MockProxy<CommandBus>
  let config: MockProxy<ConfigService>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: CommandBus,
          useValue: mock<CommandBus>(),
        },
        {
          provide: ConfigService,
          useValue: mock<ConfigService>(),
        },
      ],
    }).compile()

    controller = module.get(AuthController)
    commandBus = module.get<MockProxy<CommandBus>>(CommandBus)
    config = module.get<MockProxy<ConfigService>>(ConfigService)
  })

  describe("register", () => {
    it("should return CommonResponseDto", async () => {
      // Arrange
      const dto = new RegisterDto()
      dto.firstName = faker.person.firstName()
      dto.lastName = faker.person.lastName()
      dto.email = faker.internet.email()
      dto.password = faker.internet.password()

      const responseDto = new CommonResponseDto()

      commandBus.execute.calledWith(expect.any(RegisterCommand)).mockResolvedValue(responseDto)

      // Act
      const response = await controller.register(dto)

      // Assert
      expect(response).toBeInstanceOf(CommonResponseDto)
      expect(commandBus.execute).toHaveBeenCalledWith(expect.any(RegisterCommand))
    })
  })

  describe("login", () => {
    it("should response TokensDto", async () => {
      // Act
      config.get.mockImplementation((key: string): any => {
        switch (key) {
          case "client.web.domain":
            return "salingtau.com"
          case "app.nodeEnv":
            return NodeEnv.DEVELOPMENT
        }
      })
      config.getOrThrow.mockImplementation((key: string): any => {
        switch (key) {
          case "refreshToken.expiresIn":
            return 31536000000
        }
      })

      const response = mock<Response>()
      response.status.mockReturnValue(response)

      const dto = new LoginDto()
      dto.email = faker.internet.email()
      dto.password = faker.internet.password()

      const responseDto = new TokensDto()
      responseDto.accessToken = faker.string.alphanumeric({ length: 128 })
      responseDto.refreshToken = faker.string.alphanumeric({ length: 128 })

      const userAgent = faker.internet.userAgent()
      const ipAddress = faker.internet.ip()

      commandBus.execute.calledWith(expect.any(LoginCommand)).mockResolvedValue(responseDto)

      // Act
      await controller.login(dto, userAgent, ipAddress, response)

      // Assert
      expect(commandBus.execute).toHaveBeenCalledWith(expect.any(LoginCommand))
      expect(response.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_COOKIE_NAME,
        responseDto.refreshToken,
        expect.objectContaining({
          domain: "salingtau.com",
          httpOnly: true,
          maxAge: 31536000000,
          sameSite: "strict",
          secure: false,
        }),
      )
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK)
      expect(response.json).toHaveBeenCalledWith(expect.any(TokensDto))
    })
  })
})
