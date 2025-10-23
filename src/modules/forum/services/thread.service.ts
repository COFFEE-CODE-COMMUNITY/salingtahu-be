import { ThreadRepository } from "../repositories/thread.repository"
import { Transactional } from "../../../infrastructure/database/unit-of-work/transactional.decorator"
import { DeleteThreadResponseDto } from "../dtos/delete-thread-response.dto"
import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { CreateThreadDto } from "../dtos/create-thread.dto"
import { CreateThreadResponseDto } from "../dtos/create-thread-response.dto"
import { UserForumRepository } from "../repositories/user-forum.repository"
import { UpdateThreadDto } from "../dtos/update-thread.dto"
import { UpdateThreadResponseDto } from "../dtos/update-thread-response.dto"

export interface ThreadResponse<T> {
  message: string
  data?: T
}

@Injectable()
export class ThreadService {
  public constructor(
    private readonly threadRepository: ThreadRepository,
    private readonly userForumRepository: UserForumRepository,
  ) {}

  public async create(userId: string, dto: CreateThreadDto): Promise<ThreadResponse<CreateThreadResponseDto>> {
    const thread = await this.threadRepository.create(userId, dto)
    const user = await this.userForumRepository.findByPublicId(userId)

    if (!user) throw new UnauthorizedException({ message: "User does not exist" })

    return {
      message: `Thread created successfully`,
      data: {
        id: thread.id,
        title: thread.title,
        content: thread.content,
        category: thread.category,
        repliesCount: thread.repliesCount,
        user: user,
        createdAt: thread.createdAt,
        updatedAt: thread.updatedAt,
      },
    }
  }

  public async update(
    userId: string,
    threadId: string,
    dto: UpdateThreadDto,
  ): Promise<ThreadResponse<UpdateThreadResponseDto>> {
    const entity = await this.threadRepository.findById(threadId)

    if (!entity) throw new NotFoundException({ message: "Thread not found" })
    if (entity.userId !== userId) throw new ForbiddenException({ message: "You can only update your own thread" })

    const user = await this.userForumRepository.findByPublicId(entity.userId)
    const thread = await this.threadRepository.updateById(dto, entity)
    return {
      message: `Thread updated successfully`,
      data: {
        id: thread.id,
        title: thread.title,
        content: thread.content,
        category: thread.category,
        repliesCount: thread.repliesCount,
        user: user,
        createdAt: thread.createdAt,
        updatedAt: thread.updatedAt,
      },
    }
  }

  @Transactional()
  public async delete(userId: string, threadId: string): Promise<ThreadResponse<DeleteThreadResponseDto>> {
    const thread = await this.threadRepository.findById(threadId)

    if (!thread) throw new NotFoundException({ message: "Thread not found" })
    if (thread.userId !== userId) throw new ForbiddenException({ message: "You can only delete your own thread" })

    await this.threadRepository.delete(threadId)

    return {
      message: "Thread has successfully deleted",
      data: {
        id: thread.id,
        deletedAt: new Date(),
      },
    }
  }
}
