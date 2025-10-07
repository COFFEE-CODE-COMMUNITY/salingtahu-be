import { mock, MockProxy } from "jest-mock-extended"
import { RegisterHandler } from "./register.handler"
import { PasswordService } from "../../services/password.service"
import { UserRepository } from "../../../user/repositories/user.repository"
import { Test } from "@nestjs/testing"
import { RegisterDto } from "../../dto/register.dto"

describe('RegisterHandler', () => {
  let handler: RegisterHandler
  let passwordService: MockProxy<PasswordService>
  let userRepository: MockProxy<UserRepository>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RegisterHandler,
        {
          provide: PasswordService,
          useValue: mock<PasswordService>()
        },
        {
          provide: UserRepository,
          useValue: mock<UserRepository>()
        }
      ]
    }).compile()

    handler = module.get<RegisterHandler>(RegisterHandler)
    passwordService = module.get<MockProxy<PasswordService>>(PasswordService)
    userRepository = module.get<MockProxy<UserRepository>>(UserRepository)
  })

  it('should be defined', () => {
    expect(handler).toBeDefined()
  })

  describe('execute', () => {
    it('should register a new user and return CommonResponseDto', async () => {
      const dto = new RegisterDto()
    })
  })
})