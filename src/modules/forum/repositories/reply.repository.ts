import { BaseRepository } from "../../../common/base/base.repository"
import { Reply } from "../entities/reply.entity"
import { DataSource, EntityManager, IsNull } from "typeorm"
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

  // ✅ findPaginatedByThread
  public async findPaginatedByThread(
    threadId: string,
    page: number = 1,
    limit: number = 10,
    sort: "latest" | "oldest" = "latest",
  ): Promise<GetAllReplyByThreadResponseDto> {
    const validPage = Math.max(1, Math.floor(page))
    const validLimit = Math.min(20, Math.max(1, Math.floor(limit)))

    const qb = this.getRepository()
      .createQueryBuilder("reply")
      .leftJoinAndSelect("reply.user", "user")
      .select([
        "reply.id",
        "reply.threadId",
        "reply.content",
        "reply.createdAt",
        "reply.updatedAt",
        "user.id",
        "user.firstName",
        "user.profilePictures",
      ])
      .addSelect(subQuery => {
        return subQuery
          .select("COUNT(child.id)")
          .from(Reply, "child")
          .where("child.parentReplyId = reply.id")
          .andWhere("child.deletedAt IS NULL")
      }, "childCount")
      .where("reply.threadId = :threadId", { threadId })
      .andWhere("reply.parentReplyId IS NULL")

    qb.orderBy("reply.createdAt", sort === "oldest" ? "ASC" : "DESC")
    qb.skip((validPage - 1) * validLimit).take(validLimit)

    const rawReplies = await qb.getRawAndEntities()

    const data = rawReplies.entities.map((reply, index) => {
      const childCount = Number(rawReplies.raw[index]["childCount"]) || 0

      return {
        id: reply.id,
        threadId: reply.threadId,
        content: reply.content,
        user: reply.user
          ? {
              id: reply.user.id,
              firstname: reply.user.firstName,
              profilePicture:
                Array.isArray(reply.user.profilePictures) && reply.user.profilePictures.length > 0
                  ? {
                      url: reply.user.profilePictures[0]?.path ?? "",
                      width: reply.user.profilePictures[0]?.width ?? 0,
                      height: reply.user.profilePictures[0]?.height ?? 0,
                    }
                  : null,
            }
          : null,
        childCount,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
      }
    })

    const total = await this.getRepository().count({
      where: { threadId, parentReplyId: IsNull() },
    })
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
        threadId,
      },
    }
  }

  // ✅ findAllChildrenReply
  public async findAllChildrenReply(
    parentReplyId: string,
    page: number = 1,
    limit: number = 10,
    sort: "latest" | "oldest" = "oldest",
  ): Promise<GetAllChildrenReplyResponseDto> {
    const validPage = Math.max(1, Math.floor(page))
    const validLimit = Math.min(20, Math.max(1, Math.floor(limit)))

    const qb = this.getRepository()
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
        "user.firstName",
        "user.profilePictures",
        "parent.id",
        "parent.content",
        "parentUser.id",
        "parentUser.firstName",
        "parentUser.profilePictures",
      ])
      .where("reply.parentReplyId = :parentReplyId", { parentReplyId })
      .orderBy("reply.createdAt", sort === "latest" ? "DESC" : "ASC")
      .skip((validPage - 1) * validLimit)
      .take(validLimit)

    const [replies, total] = await qb.getManyAndCount()

    const data = replies.map(reply => ({
      id: reply.id,
      threadId: reply.threadId,
      content: reply.content,
      user: reply.user
        ? {
            id: reply.user.id,
            firstname: reply.user.firstName,
            profilePicture:
              Array.isArray(reply.user.profilePictures) && reply.user.profilePictures.length > 0
                ? {
                    url: reply.user.profilePictures[0]?.path ?? "",
                    width: reply.user.profilePictures[0]?.width ?? 0,
                    height: reply.user.profilePictures[0]?.height ?? 0,
                  }
                : null,
          }
        : null,
      parent: reply.parent
        ? {
            id: reply.parent.id,
            content: reply.parent.content,
            user: reply.parent.user
              ? {
                  id: reply.parent.user.id,
                  firstname: reply.parent.user.firstName,
                  profilePicture:
                    Array.isArray(reply.parent.user.profilePictures) && reply.parent.user.profilePictures.length > 0
                      ? {
                          url: reply.parent.user.profilePictures[0]?.path ?? "",
                          width: reply.parent.user.profilePictures[0]?.width ?? 0,
                          height: reply.parent.user.profilePictures[0]?.height ?? 0,
                        }
                      : null,
                }
              : null,
          }
        : null,
      createdAt: reply.createdAt,
      updatedAt: reply.updatedAt,
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
        parentReplyId,
      },
    }
  }
}
