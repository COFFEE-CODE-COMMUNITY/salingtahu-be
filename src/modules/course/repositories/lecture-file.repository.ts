import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../../../base/base.repository";
import { LectureFile } from "../entities/lecture-file.entity";
import { DataSource, EntityManager } from "typeorm";
import { TransactionContextService } from "../../../database/unit-of-work/transaction-context.service";

@Injectable()
export class LectureFileRepository extends BaseRepository<LectureFile> {
  public constructor(dataSource: DataSource, transactionContextService: TransactionContextService<EntityManager>) {
    super(dataSource, transactionContextService, LectureFile)
  }
}
