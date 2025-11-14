import { Query } from "@nestjs/cqrs"

export class GetInstructorTransactionHistoryQuery extends Query<any> {
  public constructor(public readonly userId: string) {
    super()
  }
}
