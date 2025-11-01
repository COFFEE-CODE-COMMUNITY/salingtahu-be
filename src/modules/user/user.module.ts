import { Module } from "@nestjs/common"
import { BullModule } from "@nestjs/bullmq"
import { UserRepository } from "./repositories/user.repository"
import { UserController } from "./controllers/user.controller"
import { UpdateProfilePictureHandler } from "./commands/handlers/update-profile-picture.handler"
import { GetCurrentUserHandler } from "./queries/handlers/get-current-user.handler"
import { GetUserHandler } from "./queries/handlers/get-user.handler"
import { UserMapper } from "./mappers/user.mapper"
import { UserService } from "./services/user.service"
import { IMAGE_PROCESSING_QUEUE } from "../../queue/image-processing.consumer"
import { ApplyAsInstructorHandler } from "./commands/handlers/apply-as-instructor.handler"
import { InstructorVerificationRepository } from "./repositories/instructor-verification.repository"
import { UpdateUserHandler } from "./commands/handlers/update-user.handler"

@Module({
  imports: [
    BullModule.registerQueue({
      name: IMAGE_PROCESSING_QUEUE,
    }),
  ],
  controllers: [UserController],
  providers: [
    // Handlers
    ApplyAsInstructorHandler,
    GetCurrentUserHandler,
    GetUserHandler,
    UpdateProfilePictureHandler,
    UpdateUserHandler,

    // Mappers
    UserMapper,

    // Services
    UserService,

    // Repositories
    InstructorVerificationRepository,
    UserRepository,
  ],
  exports: [UserRepository, UserService],
})
export class UserModule {}
