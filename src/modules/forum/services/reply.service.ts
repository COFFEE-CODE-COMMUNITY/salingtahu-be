import { ReplyRepository } from "../repositories/reply.repository"
import { ThreadRepository } from "../repositories/thread.repository"
import { CreateReplyDto } from "../dtos/replies/create-reply.dto"
import { Transactional } from "../../../infrastructure/database/unit-of-work/transactional.decorator"
import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { ReplyResponseDto } from "../dtos/replies/reply-response.dto"
import { UserForumRepository } from "../repositories/user-forum.repository"
import { UpdateReplyDto } from "../dtos/replies/update-reply.dto"
import { GetAllChildrenReplyResponseDto } from "../dtos/replies/get-all-children-reply-response.dto"
import { GetAllReplyByThreadResponseDto } from "../dtos/replies/get-all-reply-by-thread-id-response.dto"
import { Mapper } from "@automapper/core"
import { Reply } from "../entities/reply.entity"
import { User } from "../../user/entities/user.entity"

@Injectable()
export class ReplyService {
  public constructor(
    private readonly replyRepository: ReplyRepository,
    private readonly threadRepository: ThreadRepository,
    private readonly userForumRepository: UserForumRepository,
    private readonly mapper: Mapper,
  ) {}

  public async create(userId: string, dto: CreateReplyDto): Promise<ReplyResponseDto> {
    const reply = await this.replyRepository.create(userId, dto)
    const user = await this.userForumRepository.findByPublicId(userId)

    if (!user) throw new UnauthorizedException("User does not exist")
    await this.threadRepository.increment(reply.threadId)

    reply.user = user as unknown as User

    return this.mapper.map(reply, Reply, ReplyResponseDto)
  }

  public async update(userId: string, replyId: string, dto: UpdateReplyDto): Promise<ReplyResponseDto> {
    const entity = await this.replyRepository.findById(replyId)

    if (!entity) throw new NotFoundException("Reply not found")
    if (entity.userId !== userId) throw new ForbiddenException("You can only update your own replies")

    const user = await this.userForumRepository.findByPublicId(entity.userId)
    const reply = await this.replyRepository.updateById(dto, entity)

    reply.user = user as unknown as User

    return this.mapper.map(reply, Reply, ReplyResponseDto)
  }

  @Transactional()
  public async delete(userId: string, replyId: string): Promise<ReplyResponseDto> {
    const entity = await this.replyRepository.findById(replyId)
    if (!entity) throw new NotFoundException("Reply not found")

    if (entity.userId !== userId) throw new ForbiddenException("You can only delete your own replies")

    const reply = (await this.replyRepository.deleteById(entity.id)) as Reply
    const user = await this.userForumRepository.findByPublicId(reply.userId)
    await this.threadRepository.decrement(reply.threadId)

    reply.user = user as unknown as User

    return this.mapper.map(reply, Reply, ReplyResponseDto)
  }

  public async getAllReplyByThreadId(
    threadId: string,
    page: number = 1,
    limit: number = 15,
    sort: "latest" | "oldest" = "latest",
  ): Promise<GetAllReplyByThreadResponseDto> {
    return await this.replyRepository.findPaginatedByThread(threadId, page, limit, sort)
  }

  public async getAllChildrenReply(
    parentReplyId: string,
    page: number = 1,
    limit: number = 15,
    sort: "latest" | "oldest" = "latest",
  ): Promise<GetAllChildrenReplyResponseDto> {
    return await this.replyRepository.findAllChildrenReply(parentReplyId, page, limit, sort)
  }
}
