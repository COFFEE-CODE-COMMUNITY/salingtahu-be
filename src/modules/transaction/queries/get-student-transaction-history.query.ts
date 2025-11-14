import { Query } from "@nestjs/cqrs"

export class GetStudentTransactionHistoryQuery extends Query<any> {
  public constructor(public readonly userId: string) {
    super()
  }
}
