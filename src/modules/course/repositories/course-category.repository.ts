import { Injectable } from "@nestjs/common"
import { BaseRepository } from "../../../base/base.repository"
import { CourseCategory } from "../entities/course-category.entity"
import { DataSource, EntityManager } from "typeorm"
import { TransactionContextService } from "../../../database/unit-of-work/transaction-context.service"

@Injectable()
export class CourseCategoryRepository extends BaseRepository<CourseCategory> {
  public constructor(dataSource: DataSource, transactionContextService: TransactionContextService<EntityManager>) {
    super(dataSource, transactionContextService, CourseCategory)
  }

  public async existsByName(name: string): Promise<boolean> {
    return this.getRepository().exists({ where: { name } })
  }

  public async findByName(name: string): Promise<CourseCategory | null> {
    return this.getRepository().findOne({ where: { name } })
  }
}
