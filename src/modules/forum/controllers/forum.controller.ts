import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger"
import { Body, Controller, Delete, Get, Param, Patch, Post, Query as QueryParam } from "@nestjs/common"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { CreateThreadDto } from "../dtos/threads/create-thread.dto"
import { CreateThreadCommand } from "../commands/create-thread.command"
import { ThreadResponseDto } from "../dtos/threads/thread-response.dto"
import { CreateReplyDto } from "../dtos/replies/create-reply.dto"
import { CreateReplyBadRequestDto } from "../dtos/replies/create-reply-bad-request.dto"
import { CreateThreadBadRequestDto } from "../dtos/threads/create-thread-bad-request.dto"
import { CreateReplyCommand } from "../commands/create-reply.command"
import { ReplyResponseDto } from "../dtos/replies/reply-response.dto"
import { DeleteReplyCommand } from "../commands/delete-reply.command"
import { DeleteReplyBadResponseDto } from "../dtos/replies/delete-reply-bad-response"
import { DeleteThreadCommand } from "../commands/delete-thread.command"
import { DeleteThreadBadResponseDto } from "../dtos/threads/delete-thread-bad-response.dto"
import { UpdateThreadDto } from "../dtos/threads/update-thread.dto"
import { UpdateThreadCommand } from "../commands/update-thread.command"
import { UpdateThreadBadRequestDto } from "../dtos/threads/update-thread-bad-request.dto"
import { UpdateReplyCommand } from "../commands/update-reply.command"
import { UpdateReplyDto } from "../dtos/replies/update-reply.dto"
import { UpdateReplyBadRequestDto } from "../dtos/replies/update-reply-bad-request.dto"
import { GetAllThreadQuery } from "../queries/get-all-thread.query"
import { GetAllThreadResponseDto } from "../dtos/threads/get-all-thread-response.dto"
import { GetAllThreadByKeyResponseDto } from "../dtos/threads/get-all-thread-by-key-response.dto"
import { GetAllThreadByKeyQuery } from "../queries/get-all-thread-by-key.query"
import { GetAllThreadByUserIdResponseDto } from "../dtos/threads/get-all-thread-by-user-id-response.dto"
import { GetAllThreadByUserIdQuery } from "../queries/get-all-thread-by-user-id.query"
import { GetAllReplyQuery } from "../queries/get-all-reply.query"
import { GetAllChildrenReplyQuery } from "../queries/get-all-children-reply.query"
import { GetAllReplyByThreadResponseDto } from "../dtos/replies/get-all-reply-by-thread-id-response.dto"
import { GetAllChildrenReplyResponseDto } from "../dtos/replies/get-all-children-reply-response.dto"
import { Authorized } from "../../../common/guards/bearer-token.guard"
import { UserId } from "../../../common/http/user-id.decorator"

@ApiTags("Forum")
@Controller("forums")
export class ForumController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post("threads")
  @ApiOperation({
    summary: "Create new thread.",
    description: "Creates a new thread with the provided title, and content.",
  })
  @ApiCreatedResponse({
    description: "Thread successfully created",
    type: CommonResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data",
    type: CreateThreadBadRequestDto,
  })
  @Authorized()
  public async createThread(@UserId() userId: string, @Body() dto: CreateThreadDto): Promise<ThreadResponseDto> {
    return this.commandBus.execute(new CreateThreadCommand(userId, dto))
  }

  @Delete("threads/:threadId")
  @ApiOperation({
    summary: "Delete a thread",
    description: "Hard deletes a thread.",
  })
  @ApiOkResponse({
    description: "Thread successfully deleted",
    type: CommonResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data or thread not found",
    type: DeleteThreadBadResponseDto,
  })
  @Authorized()
  public async deleteThread(@UserId() userId: string, @Param("threadId") threadId: string): Promise<CommonResponseDto> {
    return this.commandBus.execute(new DeleteThreadCommand(userId, threadId))
  }

  @Patch("threads/:threadId")
  @ApiOperation({
    summary: "update a thread",
    description: "Hard deletes a thread.",
  })
  @ApiOkResponse({
    description: "Thread successfully updated",
    type: ThreadResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data or thread not found",
    type: UpdateThreadBadRequestDto,
  })
  @Authorized()
  public async updateThread(
    @UserId() userId: string,
    @Param("threadId") threadId: string,
    @Body() dto: UpdateThreadDto,
  ): Promise<ThreadResponseDto> {
    return this.commandBus.execute(new UpdateThreadCommand(userId, threadId, dto))
  }

  @Get("threads")
  @ApiOperation({
    summary: "Update a reply",
    description: "Hard deletes a thread.",
  })
  @ApiOkResponse({
    description: "Reply successfully updated",
    type: ThreadResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data or reply not found",
    type: UpdateReplyBadRequestDto,
  })
  @Authorized()
  public async getAllThread(
    @QueryParam("page") page: number,
    @QueryParam("limit") limit: number,
    @QueryParam("category") category?: string,
    @QueryParam("sort") sort?: "latest" | "popular",
  ): Promise<GetAllThreadResponseDto> {
    return await this.commandBus.execute(new GetAllThreadQuery(page, limit, category, sort))
  }

  @Get("threads/:key")
  @ApiOperation({
    summary: "Update a reply",
    description: "Hard deletes a thread.",
  })
  @ApiOkResponse({
    description: "Reply successfully updated",
    type: ThreadResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data or reply not found",
    type: UpdateReplyBadRequestDto,
  })
  @Authorized()
  public async getThreadByKey(
    @QueryParam("key") key: string,
    @QueryParam("page") page: number,
    @QueryParam("limit") limit: number,
    @QueryParam("category") category?: string,
    @QueryParam("sort") sort?: "latest" | "popular",
  ): Promise<GetAllThreadByKeyResponseDto> {
    return await this.queryBus.execute(new GetAllThreadByKeyQuery(key, page, limit, category, sort))
  }

  @Get("threads/my-threads")
  @ApiOperation({
    summary: "Update a reply",
    description: "Hard deletes a thread.",
  })
  @ApiOkResponse({
    description: "Reply successfully updated",
    type: ThreadResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data or reply not found",
    type: UpdateReplyBadRequestDto,
  })
  @Authorized()
  public async getThreadByUserId(
    @UserId() userId: string,
    @QueryParam("page") page: number,
    @QueryParam("limit") limit: number,
    @QueryParam("category") category?: string,
    @QueryParam("sort") sort?: "latest" | "popular",
  ): Promise<GetAllThreadByUserIdResponseDto> {
    return await this.queryBus.execute(new GetAllThreadByUserIdQuery(userId, page, limit, category, sort))
  }

  @Post("replies")
  @ApiOperation({
    summary: "Create new reply.",
    description: "Creates a new thread with the provided content.",
  })
  @ApiCreatedResponse({
    description: "Reply successfully created",
    type: CommonResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data",
    type: CreateReplyBadRequestDto,
  })
  @Authorized()
  public async createReply(@UserId() userId: string, @Body() dto: CreateReplyDto): Promise<ReplyResponseDto> {
    return this.commandBus.execute(new CreateReplyCommand(userId, dto))
  }

  @Delete("replies/:replyId")
  @ApiOperation({
    summary: "Delete a reply",
    description: "Soft deletes a reply by marking deletedAt field instead of removing it permanently.",
  })
  @ApiOkResponse({
    description: "Reply successfully deleted",
    type: CommonResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data or reply not found",
    type: DeleteReplyBadResponseDto,
  })
  @Authorized()
  public async deleteReply(@UserId() userId: string, @Param("replyId") replyId: string): Promise<ReplyResponseDto> {
    return this.commandBus.execute(new DeleteReplyCommand(userId, replyId))
  }

  @Patch("replies/:replyId")
  @ApiOperation({
    summary: "Update a reply",
    description: "Hard deletes a thread.",
  })
  @ApiOkResponse({
    description: "Reply successfully updated",
    type: ReplyResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data or reply not found",
    type: UpdateReplyBadRequestDto,
  })
  @Authorized()
  public async updateReply(
    @UserId() userId: string,
    @Param("replyId") replyId: string,
    @Body() dto: UpdateReplyDto,
  ): Promise<ReplyResponseDto> {
    return this.commandBus.execute(new UpdateReplyCommand(userId, replyId, dto))
  }

  @Get("replies/:threadId")
  @ApiOperation({
    summary: "Update a reply",
    description: "Hard deletes a thread.",
  })
  @ApiOkResponse({
    description: "Reply successfully updated",
    type: ReplyResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data or reply not found",
    type: UpdateReplyBadRequestDto,
  })
  @Authorized()
  public async getAllReply(
    @Param("threadId") threadId: string,
    @QueryParam("page") page: number,
    @QueryParam("limit") limit: number,
    @QueryParam("sort") sort?: "latest" | "oldest",
  ): Promise<GetAllReplyByThreadResponseDto> {
    return await this.queryBus.execute(new GetAllReplyQuery(threadId, page, limit, sort))
  }

  @Get("replies/:parentReplyId")
  @ApiOperation({
    summary: "Update a reply",
    description: "Hard deletes a thread.",
  })
  @ApiOkResponse({
    description: "Reply successfully updated",
    type: ReplyResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data or reply not found",
    type: UpdateReplyBadRequestDto,
  })
  @Authorized()
  public async getAllChildrenReply(
    @Param("parentReplyId") parentReplyId: string,
    @QueryParam("page") page: number,
    @QueryParam("limit") limit: number,
    @QueryParam("sort") sort?: "latest" | "oldest",
  ): Promise<GetAllChildrenReplyResponseDto> {
    return await this.queryBus.execute(new GetAllChildrenReplyQuery(parentReplyId, page, limit, sort))
  }
}
