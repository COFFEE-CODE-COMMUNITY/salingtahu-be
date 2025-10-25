import { ThreadRepository } from "../repositories/thread.repository"
import { Transactional } from "../../../infrastructure/database/unit-of-work/transactional.decorator"
import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { CreateThreadDto } from "../dtos/threads/create-thread.dto"
import { ThreadResponseDto } from "../dtos/threads/thread-response.dto"
import { UserForumRepository } from "../repositories/user-forum.repository"
import { UpdateThreadDto } from "../dtos/threads/update-thread.dto"
import { GetAllThreadByUserIdResponseDto } from "../dtos/threads/get-all-thread-by-user-id-response.dto"
import { GetAllThreadByKeyResponseDto } from "../dtos/threads/get-all-thread-by-key-response.dto"
import { Mapper } from "@automapper/core"
import { Thread } from "../entities/thread.entity"
import { User } from "../../user/entities/user.entity"
import { InjectMapper } from "@automapper/nestjs"

@Injectable()
export class ThreadService {
  public constructor(
    private readonly threadRepository: ThreadRepository,
    private readonly userForumRepository: UserForumRepository,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  public async create(userId: string, dto: CreateThreadDto): Promise<ThreadResponseDto> {
    const thread = await this.threadRepository.create(userId, dto)
    const user = await this.userForumRepository.findByPublicId(userId)

    if (!user) throw new UnauthorizedException({ message: "User does not exist" })

    thread.user = user as unknown as User

    return this.mapper.map(thread, Thread, ThreadResponseDto)
  }

  public async update(userId: string, threadId: string, dto: UpdateThreadDto): Promise<ThreadResponseDto> {
    const entity = await this.threadRepository.findById(threadId)

    if (!entity) throw new NotFoundException({ message: "Thread not found" })
    if (entity.userId !== userId) throw new ForbiddenException({ message: "You can only update your own thread" })

    const user = await this.userForumRepository.findByPublicId(entity.userId)
    const thread = await this.threadRepository.updateById(dto, entity)

    thread.user = user as unknown as User

    return this.mapper.map(thread, Thread, ThreadResponseDto)
  }

  @Transactional()
  public async delete(userId: string, threadId: string): Promise<void> {
    const thread = await this.threadRepository.findById(threadId)

    if (!thread) throw new NotFoundException({ message: "Thread not found" })
    if (thread.userId !== userId) throw new ForbiddenException({ message: "You can only delete your own thread" })

    await this.threadRepository.delete(threadId)
  }

  public async getAllThreads(page = 1, limit = 10, category?: string, sort?: "latest" | "popular"): Promise<any> {
    return await this.threadRepository.findPaginated(page, limit, { category, sort })
  }

  public async getAllThreadsByUserId(
    userId: string,
    page = 1,
    limit = 10,
    category?: string,
    sort?: "latest" | "popular",
  ): Promise<GetAllThreadByUserIdResponseDto> {
    return await this.threadRepository.findPaginatedByUserId(userId, page, limit, { category, sort })
  }
  public async getAllThreadByKey(
    key: string,
    page = 1,
    limit = 10,
    category?: string,
    sort?: "latest" | "popular",
  ): Promise<GetAllThreadByKeyResponseDto> {
    return await this.threadRepository.findPaginatedBySearch(key, page, limit, { category, sort })
  }
}
