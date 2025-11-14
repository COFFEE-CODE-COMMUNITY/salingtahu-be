import { Injectable } from "@nestjs/common"
import { BaseRepository } from "../../../base/base.repository"
import { Lecture } from "../entities/lecture.entity"
import { DataSource, EntityManager } from "typeorm"
import { TransactionContextService } from "../../../database/unit-of-work/transaction-context.service"

@Injectable()
export class LectureRepository extends BaseRepository<Lecture> {
  public constructor(dataSource: DataSource, transactionContextService: TransactionContextService<EntityManager>) {
    super(dataSource, transactionContextService, Lecture)
  }
}
