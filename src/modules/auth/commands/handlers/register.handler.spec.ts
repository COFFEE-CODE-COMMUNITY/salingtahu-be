import { mock, MockProxy } from "jest-mock-extended"
import { RegisterHandler } from "./register.handler"
import { PasswordService } from "../../services/password.service"
import { UserRepository } from "../../../user/repositories/user.repository"
import { Test } from "@nestjs/testing"
import { getMapperToken } from "@automapper/nestjs"
import { Mapper } from "@automapper/core"
import { faker } from "@faker-js/faker"
import { RegisterDto } from "../../dto/register.dto"
import { User } from "../../../user/entities/user.entity"
import { RegisterCommand } from "../register.command"

describe("RegisterHandler", () => {
  let handler: RegisterHandler
  let mapper: MockProxy<Mapper>
  let passwordService: MockProxy<PasswordService>
  let userRepository: MockProxy<UserRepository>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RegisterHandler,
        {
          provide: getMapperToken(),
          useValue: mock<Mapper>(),
        },
        {
          provide: PasswordService,
          useValue: mock<PasswordService>(),
        },
        {
          provide: UserRepository,
          useValue: mock<UserRepository>(),
        },
      ],
    }).compile()

    handler = module.get<RegisterHandler>(RegisterHandler)
    mapper = module.get<MockProxy<Mapper>>(getMapperToken())
    passwordService = module.get<MockProxy<PasswordService>>(PasswordService)
    userRepository = module.get<MockProxy<UserRepository>>(UserRepository)
  })

  it("should be defined", () => {
    expect(handler).toBeDefined()
  })

  describe("execute", () => {
    it("should register a new user and return CommonResponseDto", async () => {
      // Arrange
      const dto = new RegisterDto()
      dto.firstName = faker.person.firstName()
      dto.lastName = faker.person.lastName()
      dto.email = faker.internet.email()
      dto.password = faker.internet.password()

      const user = new User()
      user.firstName = dto.firstName
      user.lastName = dto.lastName
      user.email = dto.email
      user.password = dto.password

      const registerCommand = new RegisterCommand(dto)

      // @ts-expect-error
      mapper.map.calledWith(dto, RegisterDto, User).mockReturnValue(user)
      passwordService.hash.calledWith(user.password).mockResolvedValue("hashedPassword")

      // Act
      const result = await handler.execute(registerCommand)

      // Assert
      expect(mapper.map).toHaveBeenCalledWith(dto, RegisterDto, User)
      expect(passwordService.hash).toHaveBeenCalledWith(dto.password)
      expect(userRepository.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          password: "hashedPassword",
        }),
      )
      expect(result).toEqual({
        message: "User successfully registered.",
      })
    })
  })
})
