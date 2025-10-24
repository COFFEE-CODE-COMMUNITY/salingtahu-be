import { BaseRepository } from "../../../common/base/base.repository"
import { Thread } from "../entities/thread.entity"
import { DataSource, EntityManager } from "typeorm"
import { TransactionContextService } from "../../../infrastructure/database/unit-of-work/transaction-context.service"
import { CreateThreadDto } from "../dtos/threads/create-thread.dto"
import { Injectable } from "@nestjs/common"
import { UpdateThreadDto } from "../dtos/threads/update-thread.dto"

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

  public async findPaginated(
    page: number,
    limit: number,
    options?: { category?: string | undefined; sort?: "latest" | "popular" | undefined },
  ): Promise<any> {
    // Validasi dan normalisasi input
    const validPage = Math.max(1, Math.floor(page))
    const validLimit = Math.min(15, Math.max(1, Math.floor(limit)))

    const query = this.getRepository()
      .createQueryBuilder("thread")
      .leftJoinAndSelect("thread.user", "user")
      .select([
        "thread.id",
        "thread.title",
        "thread.content",
        "thread.category",
        "thread.createdAt",
        "thread.updatedAt",
        "user.id",
        "user.username",
        "user.avatarUrl",
      ])

    // Optional filter by category
    if (options?.category) {
      query.andWhere("thread.category = :category", {
        category: options.category,
      })
    }

    // PERBAIKAN: Sorting dengan proper GROUP BY untuk popular
    if (options?.sort === "popular") {
      query
        .leftJoin("thread.replies", "replies_for_sort")
        .addSelect("COUNT(replies_for_sort.id)", "reply_count")
        .groupBy("thread.id")
        .addGroupBy("user.id")
        .orderBy("reply_count", "DESC")
        .addOrderBy("thread.createdAt", "DESC") // Secondary sort untuk consistency
    } else {
      // Default: latest (sort by createdAt)
      query.orderBy("thread.createdAt", "DESC")
    }

    // Pagination
    query.skip((validPage - 1) * validLimit).take(validLimit)

    // Execute query dengan count total
    const [threads, total] = await query
      .loadRelationCountAndMap("thread.repliesCount", "thread.replies")
      .getManyAndCount()

    // Transform data ke format yang lebih clean
    const data = threads.map((thread: any) => ({
      id: thread.id,
      title: thread.title,
      content: thread.content,
      category: thread.category,
      repliesCount: thread.repliesCount || 0,
      user: {
        id: thread.user.id,
        username: thread.user.username,
        avatarUrl: thread.user.avatarUrl || null,
      },
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
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
      },
    }
  }
}
