import { Injectable } from "@nestjs/common"
import { BaseRepository } from "../../../base/base.repository"
import { InstructorVerification } from "../entities/instructor-verification.entity"
import { TransactionContextService } from "../../../database/unit-of-work/transaction-context.service"
import { EntityManager, DataSource } from "typeorm"

@Injectable()
export class InstructorVerificationRepository extends BaseRepository<InstructorVerification> {
  public constructor(dataSource: DataSource, transactionContextService: TransactionContextService<EntityManager>) {
    super(dataSource, transactionContextService, InstructorVerification)
  }
}
