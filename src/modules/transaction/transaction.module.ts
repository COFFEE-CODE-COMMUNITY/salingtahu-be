import { Module } from "@nestjs/common"
import { TransactionController } from "./controllers/transaction.controller"
import { CreateTokenHandler } from "./commands/handlers/create-token.handler"
import { TransactionMapper } from "./mappers/transaction.mapper"
import { TransactionRepository } from "./repositories/transaction.repository"
import { UserModule } from "../user/user.module"
import { CourseModule } from "../course/course.module"
import { QueueModule } from "../../queue/queue.module"

@Module({
  imports: [UserModule, CourseModule, QueueModule],
  controllers: [TransactionController],
  providers: [
    // Handlers
    CreateTokenHandler,

    // Mappers
    TransactionMapper,

    // Repositories
    TransactionRepository
  ]
})
export class TransactionModule {}
