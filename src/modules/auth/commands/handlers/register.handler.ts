import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RegisterCommand } from "../register.command";
import { CommonResponseDto } from "../../../../common/dto/common-response.dto";
import { Mapper } from "@automapper/core";
import { InjectMapper } from "@automapper/nestjs";
import { UserRepository } from "../../../user/repositories/user.repository";
import { RegisterDto } from "../../dto/register.dto";
import { User } from "../../../user/entities/user.entity";
import { plainToInstance } from "class-transformer";
import { PasswordService } from "../../services/password.service";

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  public constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly passwordService: PasswordService,
    private readonly userRepository: UserRepository
  ) {}

  public async execute(command: RegisterCommand): Promise<CommonResponseDto> {
    const user = this.mapper.map(command.dto, RegisterDto, User)
    user.password = await this.passwordService.hash(user.password)

    await this.userRepository.insert(user)

    return plainToInstance(CommonResponseDto, {
      message: "User successfully registered."
    })
  }
}