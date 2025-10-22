import { BaseRepository } from "../../../common/base/base.repository"
import { Reply } from "../entities/reply.entity"
import { DataSource, EntityManager } from "typeorm"
import { TransactionContextService } from "../../../infrastructure/database/unit-of-work/transaction-context.service"
import { Injectable } from "@nestjs/common"

@Injectable()
export class ReplyRepository extends BaseRepository<Reply> {
  public constructor(dataSource: DataSource, transactionContextService: TransactionContextService<EntityManager>) {
    super(dataSource, transactionContextService, Reply)
  }
}
