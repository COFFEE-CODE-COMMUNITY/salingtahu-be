import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { GetInstructorTransactionHistoryQuery } from "../get-instructor-transaction-history.query"
import { TransactionRepository } from "../../repositories/transaction.repository"
import { UserRepository } from "../../../user/repositories/user.repository"
import { NotFoundException } from "@nestjs/common"

@QueryHandler(GetInstructorTransactionHistoryQuery)
export class GetInstructorTransactionHistoryHandler implements IQueryHandler<GetInstructorTransactionHistoryQuery> {
  public constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async execute(query: GetInstructorTransactionHistoryQuery): Promise<any> {
    const user = await this.userRepository.findById(query.userId)

    if (!user) {
      throw new NotFoundException(`User with ID ${query.userId} does not exist`)
    }

    return await this.transactionRepository.findByInstructorId(query.userId)
  }
}
