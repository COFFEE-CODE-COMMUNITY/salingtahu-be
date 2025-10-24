import { BaseRepository } from "../../../common/base/base.repository"
import { Reply } from "../entities/reply.entity"
import { DataSource, EntityManager } from "typeorm"
import { TransactionContextService } from "../../../infrastructure/database/unit-of-work/transaction-context.service"
import { Injectable } from "@nestjs/common"
import { CreateReplyDto } from "../dtos/replies/create-reply.dto"
import { UpdateThreadDto } from "../dtos/threads/update-thread.dto"
import { GetAllReplyByThreadResponseDto } from "../dtos/replies/get-all-reply-by-thread-id-response.dto"
import { GetAllChildrenReplyResponseDto } from "../dtos/replies/get-all-children-reply-response.dto"

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

  public async findPaginatedByThread(
    threadId: string,
    page: number = 1,
    limit: number = 10,
    sort: "latest" | "oldest" = "latest",
  ): Promise<GetAllReplyByThreadResponseDto> {
    const validPage = Math.max(1, Math.floor(page))
    const validLimit = Math.min(20, Math.max(1, Math.floor(limit)))

    const query = this.getRepository()
      .createQueryBuilder("reply")
      .leftJoinAndSelect("reply.user", "user")
      .select([
        "reply.id",
        "reply.threadId",
        "reply.content",
        "reply.createdAt",
        "reply.updatedAt",
        "user.id",
        "user.username",
        "user.avatarUrl",
      ])
      .where("reply.threadId = :threadId", { threadId })
      .andWhere("reply.parentReplyId IS NULL") // Top-level replies only

    // Sorting
    if (sort === "oldest") {
      query.orderBy("reply.createdAt", "ASC")
    } else {
      query.orderBy("reply.createdAt", "DESC")
    }

    // Pagination
    query.skip((validPage - 1) * validLimit).take(validLimit)

    // Execute query dengan count children
    const [replies, total] = await query
      .loadRelationCountAndMap("reply.childCount", "reply.children", "children", qb =>
        qb.where("children.deletedAt IS NULL"),
      )
      .getManyAndCount()

    // Transform data
    const data = replies.map((reply: any) => ({
      id: reply.id,
      threadId: reply.threadId,
      content: reply.content,
      user: reply.user
        ? {
            id: reply.user.id,
            username: reply.user.username,
            avatarUrl: reply.user.avatarUrl || null,
          }
        : null,
      childCount: reply.childCount || 0,
      createdAt: reply.createdAt,
      updatedAt: reply.updatedAt,
    }))

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / validLimit)
    const hasNextPage = validPage < totalPages
    const hasPreviousPage = validPage > 1

    return {
      data,
      meta: {
        page: validPage,
        limit: validLimit,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        threadId,
      },
    }
  }

  public async findAllChildrenReply(
    parentReplyId: string,
    page: number = 1,
    limit: number = 10,
    sort: "latest" | "oldest" = "oldest",
  ): Promise<GetAllChildrenReplyResponseDto> {
    const validPage = Math.max(1, Math.floor(page))
    const validLimit = Math.min(20, Math.max(1, Math.floor(limit)))

    const query = this.getRepository()
      .createQueryBuilder("reply")
      .leftJoinAndSelect("reply.user", "user")
      .leftJoinAndSelect("reply.parent", "parent")
      .leftJoinAndSelect("parent.user", "parentUser")
      .select([
        "reply.id",
        "reply.threadId",
        "reply.content",
        "reply.createdAt",
        "reply.updatedAt",
        "user.id",
        "user.username",
        "user.avatarUrl",
        "parent.id",
        "parent.content",
        "parentUser.id",
        "parentUser.username",
        "parentUser.avatarUrl",
      ])
      .where("reply.parentReplyId = :parentReplyId", { parentReplyId })

    // Sorting - Default oldest untuk nested replies (common UX)
    if (sort === "latest") {
      query.orderBy("reply.createdAt", "DESC")
    } else {
      query.orderBy("reply.createdAt", "ASC")
    }

    // Pagination
    query.skip((validPage - 1) * validLimit).take(validLimit)

    const [replies, total] = await query.getManyAndCount()

    // Transform data
    const data = replies.map((reply: any) => ({
      id: reply.id,
      threadId: reply.threadId,
      content: reply.content,
      user: reply.user
        ? {
            id: reply.user.id,
            username: reply.user.username,
            avatarUrl: reply.user.avatarUrl || null,
          }
        : null,
      parent: {
        id: reply.parent.id,
        content: reply.parent.content,
        user: reply.parent.user
          ? {
              id: reply.parent.user.id,
              username: reply.parent.user.username,
              avatarUrl: reply.parent.user.avatarUrl || null,
            }
          : null,
      },
      createdAt: reply.createdAt,
      updatedAt: reply.updatedAt,
    }))

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / validLimit)
    const hasNextPage = validPage < totalPages
    const hasPreviousPage = validPage > 1

    return {
      data,
      meta: {
        page: validPage,
        limit: validLimit,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        parentReplyId,
      },
    }
  }
}
