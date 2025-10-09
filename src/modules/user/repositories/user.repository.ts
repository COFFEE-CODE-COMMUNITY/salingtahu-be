import { Injectable } from "@nestjs/common"
import { BaseRepository } from "../../../common/base/base.repository"
import { User } from "../entities/user.entity"
import { DataSource, EntityManager } from "typeorm"
import { TransactionContextService } from "../../../infrastructure/database/unit-of-work/transaction-context.service"

@Injectable()
export class UserRepository extends BaseRepository<User> {
  public constructor(dataSource: DataSource, transactionContextService: TransactionContextService<EntityManager>) {
    super(dataSource, transactionContextService, User)
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.getRepository().findOne({ where: { email }, relations: { oauth2Users: true } })
  }
}
