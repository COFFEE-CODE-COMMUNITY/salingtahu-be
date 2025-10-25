import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetUserQuery } from "../get-user.query"
import { UserPublicDto } from "../../dto/user-public.dto"
import { UserRepository } from "../../repositories/user.repository"
import { NotFoundException } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { CommonResponseDto } from "../../../../common/dto/common-response.dto"
import { InjectMapper } from "@automapper/nestjs"
import { Mapper } from "@automapper/core"
import { User } from "../../entities/user.entity"

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  public constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly userRepository: UserRepository,
  ) {}

  public async execute(query: GetUserQuery): Promise<UserPublicDto> {
    const user = await this.userRepository.findById(query.userId)

    if (!user) {
      throw new NotFoundException(
        plainToInstance(CommonResponseDto, {
          message: "User not found.",
        }),
      )
    }

    return this.mapper.map(user, User, UserPublicDto)
  }
}
