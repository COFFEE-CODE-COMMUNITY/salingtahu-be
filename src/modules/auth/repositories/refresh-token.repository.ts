import { Injectable } from "@nestjs/common"
import { DataSource, EntityManager } from "typeorm"
import { BaseRepository } from "../../../common/base/base.repository"
import { RefreshToken } from "../entities/refresh-token.entity"
import { TransactionContextService } from "../../../infrastructure/database/unit-of-work/transaction-context.service"

@Injectable()
export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  public constructor(dataSource: DataSource, transactionContextService: TransactionContextService<EntityManager>) {
    super(dataSource, transactionContextService, RefreshToken)
  }

  public async findByToken(token: string): Promise<RefreshToken | null> {
    return this.getRepository().findOne({
      where: { token },
    })
  }

  public async deleteByToken(refreshToken: string): Promise<void> {
    await this.getRepository().delete({
      token: refreshToken
    })
  }
}
