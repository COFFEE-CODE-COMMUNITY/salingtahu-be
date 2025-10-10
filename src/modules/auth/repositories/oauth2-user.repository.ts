import { Injectable } from "@nestjs/common"
import { BaseRepository } from "../../../common/base/base.repository"
import { OAuth2User } from "../entities/oauth2-user.entity"
import { DataSource, EntityManager } from "typeorm"
import { TransactionContextService } from "../../../infrastructure/database/unit-of-work/transaction-context.service"

@Injectable()
export class OAuth2UserRepository extends BaseRepository<OAuth2User> {
  public constructor(dataSource: DataSource, transactionContextService: TransactionContextService<EntityManager>) {
    super(dataSource, transactionContextService, OAuth2User)
  }
}
