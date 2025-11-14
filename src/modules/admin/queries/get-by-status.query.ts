import { Query } from "@nestjs/cqrs"

export class GetByStatusQuery extends Query<any> {
  public constructor() {
    super()
  }
}
