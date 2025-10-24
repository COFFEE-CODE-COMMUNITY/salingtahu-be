import { ReplyRepository } from "../repositories/reply.repository"
import { ThreadRepository } from "../repositories/thread.repository"
import { CreateReplyDto } from "../dtos/replies/create-reply.dto"
import { Transactional } from "../../../infrastructure/database/unit-of-work/transactional.decorator"
import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { DeleteReplyResponseDto } from "../dtos/replies/delete-reply-response.dto"
import { CreateReplyResponseDto } from "../dtos/replies/create-reply-response.dto"
import { UserForumRepository } from "../repositories/user-forum.repository"
import { UpdateReplyResponseDto } from "../dtos/replies/update-reply-response.dto"
import { UpdateReplyDto } from "../dtos/replies/update-reply.dto"

export interface ReplyResponse<T> {
  message: string
  data?: T
}

@Injectable()
export class ReplyService {
  public constructor(
    private readonly replyRepository: ReplyRepository,
    private readonly threadRepository: ThreadRepository,
    private readonly userForumRepository: UserForumRepository,
  ) {}

  public async create(userId: string, dto: CreateReplyDto): Promise<ReplyResponse<CreateReplyResponseDto>> {
    const reply = await this.replyRepository.create(userId, dto)
    const user = await this.userForumRepository.findByPublicId(userId)

    if (!user) throw new UnauthorizedException("User does not exist")

    return {
      message: "Reply successfully created",
      data: {
        id: reply.id,
        threadId: reply.threadId,
        parentReplyId: reply.parentReplyId || null,
        content: reply.content,
        user: user,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
      },
    }
  }

  public async update(
    userId: string,
    replyId: string,
    dto: UpdateReplyDto,
  ): Promise<ReplyResponse<UpdateReplyResponseDto>> {
    const entity = await this.replyRepository.findById(replyId)

    if (!entity) throw new NotFoundException("Reply not found")
    if (entity.userId !== userId) throw new ForbiddenException("You can only update your own replies")

    const user = await this.userForumRepository.findByPublicId(entity.userId)
    const reply = await this.replyRepository.updateById(dto, entity)

    return {
      message: "Reply successfully created",
      data: {
        id: reply.id,
        threadId: reply.threadId,
        parentReplyId: reply.parentReplyId || null,
        content: reply.content,
        user: user,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
      },
    }
  }

  @Transactional()
  public async delete(userId: string, replyId: string): Promise<ReplyResponse<DeleteReplyResponseDto>> {
    const reply = await this.replyRepository.findById(replyId)
    if (!reply) throw new NotFoundException("Reply not found")

    if (reply.userId !== userId) throw new ForbiddenException("You can only delete your own replies")

    await this.replyRepository.deleteById(replyId)
    await this.threadRepository.decrement(reply.threadId)

    return {
      message: "Reply successfully deleted",
      data: {
        id: replyId,
        deletedAt: new Date(),
      },
    }
  }
}
