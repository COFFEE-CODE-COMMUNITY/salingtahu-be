import { Body, Controller, Param, Post, Get, Query, ParseIntPipe, ParseEnumPipe, ParseBoolPipe } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { ApiTags } from "@nestjs/swagger"
import { CreateTokenCommand } from "../commands/create-token.command"
import { CreateTransactionDto } from "../dtos/create-transaction.dto"
import { Authorized } from "../../../guards/bearer-token.guard"
import { CreateTransactionResponseDto } from "../dtos/create-transaction-response.dto"
import { GetStudentTransactionHistoryQuery } from "../queries/get-student-transaction-history.query"
import { GetInstructorTransactionHistoryQuery } from "../queries/get-instructor-transaction-history.query"
import { GetAllCourseByFlagsQuery } from "../queries/get-all-course-by-flags.query"
import { parsePipeExceptionFactory } from "../../../utils/parse-pipe-exception-factory.util"
import { CourseSortBy } from "../../course/enums/course-sort-by.enum"
import { SortOrder } from "../../../enums/sort-order"
import { UserId } from "../../../http/user-id.decorator"
import { MidtransNotificationCommand } from "../commands/midtrans-notification.command"

@ApiTags("Transaction")
@Controller("transaction")
export class TransactionController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post("token")
  @Authorized()
  public async createToken(@Body() dto: CreateTransactionDto): Promise<CreateTransactionResponseDto> {
    return await this.commandBus.execute(new CreateTokenCommand(dto))
  }

  @Post("midtrans/notification")
  public async handleMidtransNotification(@Body() body: any): Promise<any> {
    console.log("🔥 Midtrans Notification Received:", body)

    return await this.commandBus.execute(new MidtransNotificationCommand(body))
  }

  @Get("instructor/:userId/history")
  @Authorized()
  public async getInstructorTransactionHistory(@Param("userId") userId: string): Promise<any> {
    return await this.queryBus.execute(new GetInstructorTransactionHistoryQuery(userId))
  }

  @Get("student/:userId/history")
  @Authorized()
  public async getStudentTransactionHistory(@Param("userId") userId: string): Promise<any> {
    return await this.queryBus.execute(new GetStudentTransactionHistoryQuery(userId))
  }

  @Get("student")
  @Authorized()
  public async getAllByBuyerId(
    @UserId() userId: string,
    @Query("purchased", new ParseBoolPipe({ optional: true, exceptionFactory: parsePipeExceptionFactory }))
    purchased: boolean = true,
    @Query("offset", new ParseIntPipe({ optional: true, exceptionFactory: parsePipeExceptionFactory }))
    offset: number = 0,
    @Query("limit", new ParseIntPipe({ optional: true, exceptionFactory: parsePipeExceptionFactory }))
    limit: number = 100,
    @Query("sortBy", new ParseEnumPipe(CourseSortBy, { optional: true, exceptionFactory: parsePipeExceptionFactory }))
    sortBy: CourseSortBy = CourseSortBy.NEWEST,
    @Query("sortOrder", new ParseEnumPipe(SortOrder, { optional: true, exceptionFactory: parsePipeExceptionFactory }))
    sortOrder: SortOrder = SortOrder.ASCENDING,
    @Query("search") search?: string
  ): Promise<any> {
    return await this.queryBus.execute(
      new GetAllCourseByFlagsQuery(userId, purchased, offset, limit, sortBy, sortOrder, search)
    )
  }
}
