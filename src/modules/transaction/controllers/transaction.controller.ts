import { Body, Controller, Post } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { ApiTags } from "@nestjs/swagger"
import { CreateTokenCommand } from "../commands/create-token.command"
import { CreateTransactionDto } from "../dtos/create-transaction.dto"
import { Authorized } from "../../../guards/bearer-token.guard"
import { CreateTransactionResponseDto } from "../dtos/create-transaction-response.dto"

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
}
