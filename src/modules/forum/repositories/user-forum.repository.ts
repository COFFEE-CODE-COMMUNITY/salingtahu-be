import { BaseRepository } from "../../../common/base/base.repository"
import { DataSource, EntityManager } from "typeorm"
import { TransactionContextService } from "../../../infrastructure/database/unit-of-work/transaction-context.service"
import { Injectable } from "@nestjs/common"
import { User } from "../../user/entities/user.entity"
import { InjectMapper } from "@automapper/nestjs"
import { Mapper } from "@automapper/core"
import { UserForumDto } from "../dtos/user-forum.dto"

@Injectable()
export class UserForumRepository extends BaseRepository<User> {
  public constructor(
    dataSource: DataSource,
    transactionContextService: TransactionContextService<EntityManager>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {
    super(dataSource, transactionContextService, User)
  }

  public async findByPublicId(id: string): Promise<UserForumDto | null> {
    const user = await this.getRepository()
      .createQueryBuilder("user")
      .select(["user.id", "user.firstName", "user.profilePictures"])
      .where("user.id = :id", { id })
      .getOne()

    if (!user) return null

    return this.mapper.map<User, UserForumDto>(user, User, UserForumDto)
  }

  // public async findByPublicIds(ids: string[]): Promise<{ id: string; username: string; avatarUrl: string | null }[]> {
  //   if (!ids.length) return []
  //   return await this.getRepository()
  //     .createQueryBuilder("user")
  //     .select(["user.id", "user.username", "user.avatarUrl"])
  //     .where("user.id IN (:...ids)", { ids })
  //     .getMany()
  // }
}
