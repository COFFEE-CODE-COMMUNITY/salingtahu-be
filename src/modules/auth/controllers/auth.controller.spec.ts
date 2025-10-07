import { Test } from "@nestjs/testing"
import { AuthController } from "./auth.controller"
import { CommandBus } from "@nestjs/cqrs"
import { mock, MockProxy } from "jest-mock-extended"
import { RegisterDto } from "../dto/register.dto"
import { faker } from "@faker-js/faker"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"
import { RegisterCommand } from "../commands/register.command"

describe("AuthController", () => {
  let controller: AuthController
  let commandBus: MockProxy<CommandBus>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: CommandBus,
          useValue: mock<CommandBus>(),
        },
      ],
    }).compile()

    controller = module.get(AuthController)
    commandBus = module.get<MockProxy<CommandBus>>(CommandBus)
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

      expect(response).toBeInstanceOf(CommonResponseDto)
      expect(commandBus.execute).toHaveBeenCalledWith(expect.any(RegisterCommand))
    })
  })
})
