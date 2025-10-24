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
    await this.getRepository().increment({ id: threadId }, "repliesCount", 1)
  }

  public async decrement(threadId: string): Promise<void> {
    await this.getRepository().decrement({ id: threadId }, "repliesCount", 1)
  }

  public async findPaginated(
    page: number,
    limit: number,
    options?: { category?: string | undefined; sort?: "latest" | "popular" | undefined },
  ): Promise<any> {
    const validPage = Math.max(1, Math.floor(page))
    const validLimit = Math.min(15, Math.max(1, Math.floor(limit)))

    const qb = this.getRepository()
      .createQueryBuilder("thread")
      .leftJoin("thread.user", "user")
      .select([
        '"thread"."id" AS "thread_id"',
        '"thread"."title" AS "thread_title"',
        '"thread"."content" AS "thread_content"',
        '"thread"."category" AS "thread_category"',
        '"thread"."created_at" AS "thread_created_at"',
        '"thread"."updated_at" AS "thread_updated_at"',
        '"user"."id" AS "user_id"',
        '"user"."first_name" AS "user_firstname"',
        '"user"."profile_picture_path" AS "user_profilePicturePath"',
      ])
      .addSelect(
        sub =>
          sub
            .select("COUNT(reply.id)")
            .from("replies", "reply")
            .where("reply.thread_id = thread.id")
            .andWhere("reply.deleted_at IS NULL"),
        "reply_count",
      )

    if (options?.category) {
      qb.andWhere("thread.category = :category", { category: options.category })
    }

    qb.orderBy(options?.sort === "popular" ? "reply_count" : "thread.created_at", "DESC")
    qb.skip((validPage - 1) * validLimit).take(validLimit)

    const rawThreads = await qb.getRawMany()

    const total = await this.getRepository().count({
      where: options?.category ? { category: options.category } : {},
    })
    const data = rawThreads.map(row => ({
      id: row.thread_id,
      title: row.thread_title,
      content: row.thread_content,
      category: row.thread_category,
      repliesCount: Number(row.reply_count ?? 0),
      user: {
        id: row.user_id,
        firstname: row.user_firstname,
        profilePicturePath: row.user_profilePicturePath ?? null,
      },
      createdAt: row.thread_created_at,
      updatedAt: row.thread_updated_at,
    }))
    const totalPages = Math.ceil(total / validLimit)
    return {
      data,
      meta: {
        page: validPage,
        limit: validLimit,
        total,
        totalPages,
        hasNextPage: validPage < totalPages,
        hasPreviousPage: validPage > 1,
      },
    }
  }

  public async findPaginatedByUserId(
    userId: string,
    page: number,
    limit: number,
    options?: { category?: string | undefined; sort?: "latest" | "popular" | undefined },
  ): Promise<any> {
    const validPage = Math.max(1, Math.floor(page))
    const validLimit = Math.min(15, Math.max(1, Math.floor(limit)))

    const qb = this.getRepository()
      .createQueryBuilder("thread")
      .leftJoin("thread.user", "user")
      .select([
        '"thread"."id" AS "thread_id"',
        '"thread"."title" AS "thread_title"',
        '"thread"."content" AS "thread_content"',
        '"thread"."category" AS "thread_category"',
        '"thread"."created_at" AS "thread_created_at"',
        '"thread"."updated_at" AS "thread_updated_at"',
        '"user"."id" AS "user_id"',
        '"user"."first_name" AS "user_firstname"',
        '"user"."profile_picture_path" AS "user_profilePicturePath"',
      ])
      .addSelect(
        sub =>
          sub
            .select("COUNT(reply.id)")
            .from("replies", "reply")
            .where("reply.thread_id = thread.id")
            .andWhere("reply.deleted_at IS NULL"),
        "reply_count",
      )
      .where("user.id = :userId", { userId })

    if (options?.category) {
      qb.andWhere("thread.category = :category", { category: options.category })
    }

    qb.orderBy(options?.sort === "popular" ? "reply_count" : "thread.created_at", "DESC")

    qb.skip((validPage - 1) * validLimit).take(validLimit)

    const rawThreads = await qb.getRawMany()
    const total = await this.getRepository().count({
      where: options?.category ? { category: options.category } : {},
    })

    const data = rawThreads.map(row => ({
      id: row.thread_id,
      title: row.thread_title,
      content: row.thread_content,
      category: row.thread_category,
      repliesCount: Number(row.reply_count ?? 0),
      user: {
        id: row.user_id,
        firstname: row.user_firstname,
        profilePictures: row.user_profilePictures ?? null,
      },
      createdAt: row.thread_created_at,
      updatedAt: row.thread_updated_at,
    }))

    const totalPages = Math.ceil(total / validLimit)
    return {
      data,
      meta: {
        page: validPage,
        limit: validLimit,
        total,
        totalPages,
        hasNextPage: validPage < totalPages,
        hasPreviousPage: validPage > 1,
      },
    }
  }

  public async findPaginatedBySearch(
    searchKey: string,
    page: number,
    limit: number,
    options?: { category?: string | undefined; sort?: "latest" | "popular" | undefined },
  ): Promise<any> {
    const validPage = Math.max(1, Math.floor(page))
    const validLimit = Math.min(15, Math.max(1, Math.floor(limit)))

    const qb = this.getRepository()
      .createQueryBuilder("thread")
      .leftJoin("thread.user", "user")
      .select([
        '"thread"."id" AS "thread_id"',
        '"thread"."title" AS "thread_title"',
        '"thread"."content" AS "thread_content"',
        '"thread"."category" AS "thread_category"',
        '"thread"."created_at" AS "thread_created_at"',
        '"thread"."updated_at" AS "thread_updated_at"',
        '"user"."id" AS "user_id"',
        '"user"."first_name" AS "user_firstname"',
        '"user"."profile_picture_path" AS "user_profilePicturePath"',
      ])
      .addSelect(
        sub =>
          sub
            .select("COUNT(reply.id)")
            .from("replies", "reply")
            .where("reply.thread_id = thread.id")
            .andWhere("reply.deleted_at IS NULL"),
        "reply_count",
      )

    if (searchKey.trim()) {
      qb.where("(LOWER(thread.title) LIKE LOWER(:searchKey) OR LOWER(thread.content) LIKE LOWER(:searchKey))", {
        searchKey: `%${searchKey}%`,
      })
    }

    if (options?.category) {
      qb.andWhere("thread.category = :category", { category: options.category })
    }

    qb.orderBy(options?.sort === "popular" ? "reply_count" : "thread.created_at", "DESC")

    qb.skip((validPage - 1) * validLimit).take(validLimit)

    const rawThreads = await qb.getRawMany()
    const total = await this.getRepository().count({
      where: options?.category ? { category: options.category } : {},
    })

    const data = rawThreads.map(row => ({
      id: row.thread_id,
      title: row.thread_title,
      content: row.thread_content,
      category: row.thread_category,
      repliesCount: Number(row.reply_count ?? 0),
      user: {
        id: row.user_id,
        firstname: row.user_firstname,
        profilePictures: row.user_profilePictures ?? null,
      },
      createdAt: row.thread_created_at,
      updatedAt: row.thread_updated_at,
    }))

    const totalPages = Math.ceil(total / validLimit)
    return {
      data,
      meta: {
        page: validPage,
        limit: validLimit,
        total,
        totalPages,
        hasNextPage: validPage < totalPages,
        hasPreviousPage: validPage > 1,
        searchKey: searchKey || null,
      },
    }
  }
}
