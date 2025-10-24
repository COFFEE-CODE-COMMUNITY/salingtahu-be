import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger"
import { Body, Controller, Delete, Get, Param, Patch, Post, Query as QueryParam } from "@nestjs/common"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"
import { CommandBus } from "@nestjs/cqrs"
import { CreateThreadDto } from "../dtos/threads/create-thread.dto"
import { CreateThreadCommand } from "../commands/create-thread.command"
import { CreateThreadResponseDto } from "../dtos/threads/create-thread-response.dto"
import { CreateReplyDto } from "../dtos/replies/create-reply.dto"
import { CreateReplyBadRequestDto } from "../dtos/replies/create-reply-bad-request.dto"
import { CreateThreadBadRequestDto } from "../dtos/threads/create-thread-bad-request.dto"
import { CreateReplyCommand } from "../commands/create-reply.command"
import { CreateReplyResponseDto } from "../dtos/replies/create-reply-response.dto"
import { DeleteReplyCommand } from "../commands/delete-reply.command"
import { DeleteReplyResponseDto } from "../dtos/replies/delete-reply-response.dto"
import { DeleteReplyBadResponseDto } from "../dtos/replies/delete-reply-bad-response"
import { ReplyResponse } from "../services/reply.service"
import { ThreadResponse } from "../services/thread.service"
import { DeleteThreadCommand } from "../commands/delete-thread.command"
import { DeleteThreadResponseDto } from "../dtos/threads/delete-thread-response.dto"
import { DeleteThreadBadResponseDto } from "../dtos/threads/delete-thread-bad-response.dto"
import { UpdateThreadDto } from "../dtos/threads/update-thread.dto"
import { UpdateThreadCommand } from "../commands/update-thread.command"
import { UpdateThreadResponseDto } from "../dtos/threads/update-thread-response.dto"
import { UpdateThreadBadRequestDto } from "../dtos/threads/update-thread-bad-request.dto"
import { UpdateReplyCommand } from "../commands/update-reply.command"
import { UpdateReplyDto } from "../dtos/replies/update-reply.dto"
import { UpdateReplyResponseDto } from "../dtos/replies/update-reply-response.dto"
import { UpdateReplyBadRequestDto } from "../dtos/replies/update-reply-bad-request.dto"
import { GetAllThreadCommand } from "../commands/get-all-thread.command"
import { GetAllThreadResponseDto } from "../dtos/threads/get-all-thread-response.dto"

@ApiTags("Forums")
@Controller("forums")
export class ForumController {
  public constructor(private readonly commandBus: CommandBus) {}

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
  // need to use guard
  public async createThread(
    @QueryParam("userId") userId: string,
    @Body() dto: CreateThreadDto,
  ): Promise<ThreadResponse<CreateThreadResponseDto>> {
    return this.commandBus.execute(new CreateThreadCommand(userId, dto))
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
  // need to use guard
  public async createReply(
    userId: string,
    @Body() dto: CreateReplyDto,
  ): Promise<ReplyResponse<CreateReplyResponseDto>> {
    return this.commandBus.execute(new CreateReplyCommand(userId, dto))
  }

  @Delete("replies/:replyId")
  @ApiOperation({
    summary: "Delete a reply",
    description: "Soft deletes a reply by marking deletedAt field instead of removing it permanently.",
  })
  @ApiOkResponse({
    description: "Reply successfully deleted",
    type: DeleteReplyResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data or reply not found",
    type: DeleteReplyBadResponseDto,
  })
  public async deleteReply(
    userId: string,
    @Param("replyId") replyId: string,
  ): Promise<ReplyResponse<DeleteReplyResponseDto>> {
    return this.commandBus.execute(new DeleteReplyCommand(userId, replyId))
  }

  @Delete("threads/:threadId")
  @ApiOperation({
    summary: "Delete a thread",
    description: "Hard deletes a thread.",
  })
  @ApiOkResponse({
    description: "Thread successfully deleted",
    type: DeleteThreadResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data or thread not found",
    type: DeleteThreadBadResponseDto,
  })
  public async deleteThread(
    userId: string,
    @Param("threadId") threadId: string,
  ): Promise<ThreadResponse<DeleteThreadResponseDto>> {
    return this.commandBus.execute(new DeleteThreadCommand(userId, threadId))
  }

  @Patch("threads/:threadId")
  @ApiOperation({
    summary: "update a thread",
    description: "Hard deletes a thread.",
  })
  @ApiOkResponse({
    description: "Thread successfully updated",
    type: UpdateThreadResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data or thread not found",
    type: UpdateThreadBadRequestDto,
  })
  public async updateThread(
    userId: string,
    @Param("threadId") threadId: string,
    @Body() dto: UpdateThreadDto,
  ): Promise<ThreadResponse<UpdateThreadResponseDto>> {
    return this.commandBus.execute(new UpdateThreadCommand(userId, threadId, dto))
  }

  @Patch("replies/:replyId")
  @ApiOperation({
    summary: "Update a reply",
    description: "Hard deletes a thread.",
  })
  @ApiOkResponse({
    description: "Reply successfully updated",
    type: UpdateReplyResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data or reply not found",
    type: UpdateReplyBadRequestDto,
  })
  public async updateReply(
    userId: string,
    @Param("replyId") replyId: string,
    @Body() dto: UpdateReplyDto,
  ): Promise<ReplyResponse<UpdateReplyResponseDto>> {
    return this.commandBus.execute(new UpdateReplyCommand(userId, replyId, dto))
  }

  @Get("threads")
  @ApiOperation({
    summary: "Update a reply",
    description: "Hard deletes a thread.",
  })
  @ApiOkResponse({
    description: "Reply successfully updated",
    type: UpdateReplyResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data or reply not found",
    type: UpdateReplyBadRequestDto,
  })
  public async getAllThread(
    @QueryParam("page") page: number,
    @QueryParam("limit") limit: number,
    @QueryParam("category") category?: string,
    @QueryParam("sort") sort?: "latest" | "popular",
  ): Promise<GetAllThreadResponseDto> {
    return await this.commandBus.execute(new GetAllThreadCommand(page, limit, category, sort))
  }

  @Get("threads/:category")
  @ApiOperation({
    summary: "Update a reply",
    description: "Hard deletes a thread.",
  })
  @ApiOkResponse({
    description: "Reply successfully updated",
    type: UpdateReplyResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data or reply not found",
    type: UpdateReplyBadRequestDto,
  })
  public async getThreadByCategory(): Promise<void> {
    console.log(Promise)
  }

  @Get("threads/:key")
  @ApiOperation({
    summary: "Update a reply",
    description: "Hard deletes a thread.",
  })
  @ApiOkResponse({
    description: "Reply successfully updated",
    type: UpdateReplyResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data or reply not found",
    type: UpdateReplyBadRequestDto,
  })
  public async getThreadByKey(): Promise<void> {
    console.log(Promise)
  }

  @Get("threads/:userId")
  @ApiOperation({
    summary: "Update a reply",
    description: "Hard deletes a thread.",
  })
  @ApiOkResponse({
    description: "Reply successfully updated",
    type: UpdateReplyResponseDto,
  })
  @ApiBadRequestResponse({
    description: "Invalid input data or reply not found",
    type: UpdateReplyBadRequestDto,
  })
  public async getThreadByUserId(): Promise<void> {
    console.log(Promise)
  }
}
