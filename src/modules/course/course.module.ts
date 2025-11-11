import { Module } from "@nestjs/common"
import { CourseController } from "./controllers/course.controller"
import { CreateCourseHandler } from "./commands/handlers/create-course.handler"
import { CourseRepository } from "./repositories/course.repository"
import { CourseMapper } from "./mappers/course.mapper"
import { CourseSubscriber } from "./entities/subscribers/course.subscriber"
import { UserModule } from "../user/user.module"
import { GetCourseHandler } from "./queries/handlers/get-course.handler"
import { GetCoursesHandler } from "./queries/handlers/get-courses.handler"
import { CourseCategoryRepository } from "./repositories/course-category.repository"

@Module({
  imports: [UserModule],
  controllers: [CourseController],
  providers: [
    // Handlers
    CreateCourseHandler,
    GetCourseHandler,
    GetCoursesHandler,

    // Mappers
    CourseMapper,

    // Repositories
    CourseRepository,
    CourseCategoryRepository,

    // Subscribers
    CourseSubscriber
  ]
})
export class CourseModule {}
