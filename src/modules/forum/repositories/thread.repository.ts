import { BaseRepository } from "../../../common/base/base.repository"
import { Thread } from "../entities/thread.entity"
import { DataSource, EntityManager } from "typeorm"
import { TransactionContextService } from "../../../infrastructure/database/unit-of-work/transaction-context.service"
import { CreateThreadDto } from "../dtos/create-thread.dto"
import { Injectable } from "@nestjs/common"

@Injectable()
export class ThreadRepository extends BaseRepository<Thread> {
  public constructor(dataSource: DataSource, transactionContextService: TransactionContextService<EntityManager>) {
    super(dataSource, transactionContextService, Thread)
  }

  public async createThread(userId: string, dto: CreateThreadDto): Promise<Thread> {
    const entity = this.getRepository().create({
      userId,
      title: dto.title,
      content: dto.content,
      category: dto.category,
      repliesCount: 0,
    })

    return await this.getRepository().save(entity)
  }
}
