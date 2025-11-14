import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../../../base/base.repository";
import { LectureExternal } from "../entities/lecture-external.entity";
import { DataSource, EntityManager } from "typeorm";
import { TransactionContextService } from "../../../database/unit-of-work/transaction-context.service";

@Injectable()
export class LectureExternalRepository extends BaseRepository<LectureExternal> {
  public constructor(dataSource: DataSource, transactionContextService: TransactionContextService<EntityManager>)  {
    super(dataSource, transactionContextService, LectureExternal)
  }
}
