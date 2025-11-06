import { Injectable } from "@nestjs/common"
import { BaseRepository } from "../../../base/base.repository"
import { Course } from "../entities/course.entity"
import { DataSource, EntityManager } from "typeorm"
import { TransactionContextService } from "../../../database/unit-of-work/transaction-context.service"

@Injectable()
export class CourseRepository extends BaseRepository<Course> {
  public constructor(dataSource: DataSource, transactionContextService: TransactionContextService<EntityManager>) {
    super(dataSource, transactionContextService, Course)
  }
}
