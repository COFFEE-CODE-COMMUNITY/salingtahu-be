import { Module } from "@nestjs/common"
import { TransactionController } from "./controllers/transaction.controller"
import { CreateTokenHandler } from "./commands/handlers/create-token.handler"
import { TransactionMapper } from "./mappers/transaction.mapper"
import { TransactionRepository } from "./repositories/transaction.repository"
import { UserModule } from "../user/user.module"
import { CourseModule } from "../course/course.module"
import { QueueModule } from "../../queue/queue.module"
import { GetAllCourseByFlagsHandler } from "./queries/handlers/get-all-course-by-flags.handler"
import { GetInstructorTransactionHistoryHandler } from "./queries/handlers/get-instructor-transaction-history.handler"
import { GetStudentTransactionHistoryHandler } from "./queries/handlers/get-student-transaction-history.handler"
import { MidtransNotificationHandler } from "./commands/handlers/midtrans-notification.handler"

@Module({
  imports: [UserModule, CourseModule, QueueModule],
  controllers: [TransactionController],
  providers: [
    // Handlers
    CreateTokenHandler,
    GetAllCourseByFlagsHandler,
    GetInstructorTransactionHistoryHandler,
    GetStudentTransactionHistoryHandler,
    MidtransNotificationHandler,

    // Mappers
    TransactionMapper,

    // Repositories
    TransactionRepository
  ]
})
export class TransactionModule {}
