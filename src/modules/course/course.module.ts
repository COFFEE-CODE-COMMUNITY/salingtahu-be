import { Module } from "@nestjs/common"
import { CourseController } from "./controllers/course.controller"
import { CreateCourseHandler } from "./commands/handlers/create-course.handler"
import { CourseRepository } from "./repositories/course.repository"
import { CourseMapper } from "./mappers/course.mapper"
import { CourseSubscriber } from "./entities/subscribers/course.subscriber"
import { UserModule } from "../user/user.module"

@Module({
  imports: [UserModule],
  controllers: [CourseController],
  providers: [
    // Handlers
    CreateCourseHandler,

    // Mappers
    CourseMapper,

    // Repositories
    CourseRepository,

    // Subscribers
    CourseSubscriber
  ]
})
export class CourseModule {}
