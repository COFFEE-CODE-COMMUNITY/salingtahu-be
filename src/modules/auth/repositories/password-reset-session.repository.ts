import { Injectable } from "@nestjs/common"
import { BaseRepository } from "../../../base/base.repository"
import { PasswordResetSession } from "../entities/password-reset-session.entity"
import { DataSource, EntityManager } from "typeorm"
import { TransactionContextService } from "../../../database/unit-of-work/transaction-context.service"

@Injectable()
export class PasswordResetSessionRepository extends BaseRepository<PasswordResetSession> {
  public constructor(dataSource: DataSource, transactionContextService: TransactionContextService<EntityManager>) {
    super(dataSource, transactionContextService, PasswordResetSession)
  }

  public async findByToken(token: string): Promise<PasswordResetSession | null> {
    return this.getRepository().findOne({ where: { token }, relations: ["user"] })
  }
}
