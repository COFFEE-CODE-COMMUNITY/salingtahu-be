import { Injectable } from "@nestjs/common"
import { DataSource, EntityManager, MoreThan } from "typeorm"
import { BaseRepository } from "../../../base/base.repository"
import { RefreshToken } from "../entities/refresh-token.entity"
import { TransactionContextService } from "../../../database/unit-of-work/transaction-context.service"
import { EntityId } from "../../../base/base.entity"

@Injectable()
export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  public constructor(dataSource: DataSource, transactionContextService: TransactionContextService<EntityManager>) {
    super(dataSource, transactionContextService, RefreshToken)
  }

  public async findByToken(token: string): Promise<RefreshToken | null> {
    return this.getRepository().findOne({
      where: { token },
      relations: ["user"]
    })
  }

  public async findActiveByUserId(userId: EntityId): Promise<RefreshToken[]> {
    return this.getRepository().find({
      where: { user: { id: userId }, revoked: false, expiresAt: MoreThan(new Date()) }
    })
  }

  public async deleteByToken(refreshToken: string): Promise<void> {
    await this.getRepository().delete({
      token: refreshToken
    })
  }
}
