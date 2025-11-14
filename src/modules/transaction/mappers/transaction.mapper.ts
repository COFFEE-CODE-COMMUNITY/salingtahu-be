import { Injectable } from "@nestjs/common"
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs"
import { createMap, Mapper } from "@automapper/core"
import { CreateTransactionDto } from "../dtos/create-transaction.dto"
import { Transaction } from "../entities/transaction.entity"

@Injectable()
export class TransactionMapper extends AutomapperProfile {
  public constructor(@InjectMapper() mapper: Mapper) {
    super(mapper)
  }

  public override get profile() {
    return (mapper: Mapper): void => {
      createMap(mapper, CreateTransactionDto, Transaction)
    }
  }
}
