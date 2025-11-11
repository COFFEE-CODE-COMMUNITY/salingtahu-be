import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../../../base/base.repository";
import { CourseSection } from "../entities/course-section.entity";
import { DataSource, EntityManager } from "typeorm";
import { TransactionContextService } from "../../../database/unit-of-work/transaction-context.service";

@Injectable()
export class CourseSectionRepository extends BaseRepository<CourseSection> {
  public constructor(dataSource: DataSource, transactionContextService: TransactionContextService<EntityManager>) {
    super(dataSource, transactionContextService, CourseSection)
  }
}
