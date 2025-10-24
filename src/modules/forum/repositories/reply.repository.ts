import { BaseRepository } from "../../../common/base/base.repository"
import { Reply } from "../entities/reply.entity"
import { DataSource, EntityManager } from "typeorm"
import { TransactionContextService } from "../../../infrastructure/database/unit-of-work/transaction-context.service"
import { Injectable } from "@nestjs/common"
import { CreateReplyDto } from "../dtos/replies/create-reply.dto"
import { UpdateThreadDto } from "../dtos/threads/update-thread.dto"

@Injectable()
export class ReplyRepository extends BaseRepository<Reply> {
  public constructor(dataSource: DataSource, transactionContextService: TransactionContextService<EntityManager>) {
    super(dataSource, transactionContextService, Reply)
  }

  public async create(userId: string, dto: CreateReplyDto): Promise<Reply> {
    const entity = this.getRepository().create({
      userId,
      threadId: dto.threadId,
      parentReplyId: dto.parentReplyId || null,
      content: dto.content,
    })

    return await this.getRepository().save(entity)
  }

  public async findById(id: string): Promise<Reply | null> {
    return await this.getRepository().findOne({
      where: { id },
      relations: ["user", "thread", "parent"],
    })
  }

  public async isOwner(replyId: string, userId: string): Promise<boolean> {
    const reply = await this.getRepository().findOne({
      where: { id: replyId, userId },
      withDeleted: true,
    })

    return !!reply
  }

  public async updateById(dto: UpdateThreadDto, entity: Reply): Promise<Reply> {
    Object.assign(entity, dto)
    entity.updatedAt = new Date()
    return await this.getRepository().save(entity)
  }

  public async deleteById(id: string): Promise<Reply | null> {
    const reply = await this.getRepository().findOne({
      where: { id },
      relations: ["user", "thread", "parent"],
    })

    if (reply) {
      reply.deletedAt = new Date()
      return await this.getRepository().save(reply)
    }
    return null
  }
}
