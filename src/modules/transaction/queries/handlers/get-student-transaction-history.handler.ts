import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetStudentTransactionHistoryQuery } from "../get-student-transaction-history.query"
import { TransactionRepository } from "../../repositories/transaction.repository"
import { NotFoundException } from "@nestjs/common"

@QueryHandler(GetStudentTransactionHistoryQuery)
export class GetStudentTransactionHistoryHandler implements IQueryHandler<GetStudentTransactionHistoryQuery> {
  public constructor(private readonly transactionRepository: TransactionRepository) {}

  public async execute(query: GetStudentTransactionHistoryQuery): Promise<any> {
    if (!query.userId) {
      return new NotFoundException({
        message: `User does not exist`
      })
    }

    return await this.transactionRepository.findByUserId(query.userId)
  }
}
