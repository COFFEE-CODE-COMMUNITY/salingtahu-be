import { Injectable } from "@nestjs/common"
import { BaseRepository } from "../../../base/base.repository"
import { LectureArticle } from "../entities/lecture-article.entity"
import { DataSource, EntityManager } from "typeorm"
import { TransactionContextService } from "../../../database/unit-of-work/transaction-context.service"

@Injectable()
export class LectureArticleRepository extends BaseRepository<LectureArticle> {
  public constructor(dataSource: DataSource, transactionContextService: TransactionContextService<EntityManager>) {
    super(dataSource, transactionContextService, LectureArticle)
  }
}
