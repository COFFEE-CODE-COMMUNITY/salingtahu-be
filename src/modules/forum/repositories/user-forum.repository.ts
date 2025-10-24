import { BaseRepository } from "../../../common/base/base.repository"
import { DataSource, EntityManager } from "typeorm"
import { TransactionContextService } from "../../../infrastructure/database/unit-of-work/transaction-context.service"
import { Injectable } from "@nestjs/common"
import { User } from "../../user/entities/user.entity"

@Injectable()
export class UserForumRepository extends BaseRepository<User> {
  public constructor(dataSource: DataSource, transactionContextService: TransactionContextService<EntityManager>) {
    super(dataSource, transactionContextService, User)
  }

  public async findByPublicId(
    id: string,
  ): Promise<{ id: string; username: string; profilePicturePath: string | null } | null> {
    const user = await this.getRepository()
      .createQueryBuilder("user")
      .select(["user.id", "user.firstname", "user.lastname", "user.profilePicturePath"])
      .where("user.id = :id", { id })
      .getOne()

    if (!user) return null

    return {
      id: user.id,
      username: user.firstName + " " + user.lastName,
      profilePicturePath: user.profilePicturePath ?? null,
    }
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
