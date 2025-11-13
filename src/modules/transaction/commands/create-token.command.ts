import { Command } from "@nestjs/cqrs"
import { CreateTransactionDto } from "../dtos/create-transaction.dto"

export class CreateTokenCommand extends Command<any> {
  public constructor(public readonly dto: CreateTransactionDto) {
    super()
  }
}
