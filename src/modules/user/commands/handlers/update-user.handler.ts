import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { UpdateUserCommand } from "../update-user.command"
import { UserDto } from "../../dto/user.dto"
import { UserRepository } from "../../repositories/user.repository"
import { NotFoundException } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { CommonResponseDto } from "../../../../dto/common-response.dto"
import { InjectMapper } from "@automapper/nestjs"
import { Mapper } from "@automapper/core"
import { User } from "../../entities/user.entity"

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  public constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly userRepository: UserRepository
  ) {}

  public async execute({ userId, dto }: UpdateUserCommand): Promise<UserDto> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new NotFoundException(
        plainToInstance(CommonResponseDto, {
          message: "User not found."
        })
      )
    }

    return this.mapper.map(await this.userRepository.merge(user, dto), User, UserDto)
  }
}
