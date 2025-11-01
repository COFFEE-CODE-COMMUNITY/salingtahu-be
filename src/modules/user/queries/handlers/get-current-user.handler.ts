import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetCurrentUserQuery } from "../get-current-user.query"
import { UserDto } from "../../dto/user.dto"
import { UserRepository } from "../../repositories/user.repository"
import { NotFoundException } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { CommonResponseDto } from "../../../../dto/common-response.dto"
import { Mapper } from "@automapper/core"
import { InjectMapper } from "@automapper/nestjs"
import { User } from "../../entities/user.entity"

@QueryHandler(GetCurrentUserQuery)
export class GetCurrentUserHandler implements IQueryHandler<GetCurrentUserQuery> {
  public constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly userRepository: UserRepository
  ) {}

  public async execute(query: GetCurrentUserQuery): Promise<UserDto> {
    const user = await this.userRepository.findById(query.userId)

    if (!user) {
      throw new NotFoundException(
        plainToInstance(CommonResponseDto, {
          message: "User not found."
        })
      )
    }

    return this.mapper.map(user, User, UserDto)
  }
}
