import { Module } from "@nestjs/common"
import { InstructorController } from "./controllers/instructor.controller"
import { ApplyAsInstructorHandler } from "./commands/handlers/apply-as-instructor.handler"
import { InstructorRepository } from "./repositories/instructor.repository"
import { UserModule } from "../user/user.module"

@Module({
  imports: [UserModule],
  controllers: [InstructorController],
  providers: [
    // Handlers
    ApplyAsInstructorHandler,

    // Repositories
    InstructorRepository,
  ],
})
export class InstructorModule {}
