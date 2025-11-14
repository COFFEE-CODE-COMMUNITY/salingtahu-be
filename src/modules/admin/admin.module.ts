import { Module } from "@nestjs/common"
import { CourseModule } from "../course/course.module"
import { AdminController } from "./controllers/admin.controller"
import { UpdateCourseStatusHandler } from "./command/handlers/update-course-status.handler"
import { GetByStatusHandler } from "./queries/handlers/get-by-status.handler"
import { AdminRepository } from "./repositories/admin.repository"

@Module({
  imports: [CourseModule],
  controllers: [AdminController],
  providers: [
    // Handlers
    UpdateCourseStatusHandler,

    // Queries
    GetByStatusHandler,

    // Repositories
    AdminRepository
  ]
})
export class AdminModule {}
