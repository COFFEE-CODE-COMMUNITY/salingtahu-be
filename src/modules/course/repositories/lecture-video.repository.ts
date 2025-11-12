import { Injectable } from "@nestjs/common"
import { BaseRepository } from "../../../base/base.repository"
import { LectureVideo } from "../entities/lecture-video.entity"
import { DataSource, EntityManager } from "typeorm"
import { TransactionContextService } from "../../../database/unit-of-work/transaction-context.service"

@Injectable()
export class LectureVideoRepository extends BaseRepository<LectureVideo> {
  public constructor(dataSource: DataSource, transactionContextService: TransactionContextService<EntityManager>) {
    super(dataSource, transactionContextService, LectureVideo)
  }

  public async findByLectureId(lectureId: string): Promise<LectureVideo | null> {
    return this.getRepository().findOne({
      where: { lecture: { id: lectureId } }
    })
  }
}
