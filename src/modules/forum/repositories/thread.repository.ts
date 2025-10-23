import { BaseRepository } from "../../../common/base/base.repository"
import { Thread } from "../entities/thread.entity"
import { DataSource, EntityManager } from "typeorm"
import { TransactionContextService } from "../../../infrastructure/database/unit-of-work/transaction-context.service"
import { CreateThreadDto } from "../dtos/create-thread.dto"
import { Injectable } from "@nestjs/common"
import { UpdateThreadDto } from "../dtos/update-thread.dto"

@Injectable()
export class ThreadRepository extends BaseRepository<Thread> {
  public constructor(dataSource: DataSource, transactionContextService: TransactionContextService<EntityManager>) {
    super(dataSource, transactionContextService, Thread)
  }

  public async create(userId: string, dto: CreateThreadDto): Promise<Thread> {
    const entity = this.getRepository().create({
      userId,
      title: dto.title,
      content: dto.content,
      category: dto.category,
      repliesCount: 0,
    })

    return await this.getRepository().save(entity)
  }

  public async updateById(dto: UpdateThreadDto, entity: Thread): Promise<Thread> {
    Object.assign(entity, dto)
    entity.updatedAt = new Date()
    return await this.getRepository().save(entity)
  }

  public async isOwner(threadId: string, userId: string): Promise<boolean> {
    const thread = await this.getRepository().findOne({
      where: { id: threadId, userId },
    })

    return !!thread
  }

  public async increment(threadId: string): Promise<void> {
    await this.getRepository().increment({ id: threadId }, "totalReply", 1)
  }
  public async decrement(threadId: string): Promise<void> {
    await this.getRepository().decrement({ id: threadId }, "totalReply", 1)
  }
}
