import { Module } from "@nestjs/common"
import { InstructorController } from "./controllers/instructor.controller"
import { ApplyAsInstructorHandler } from "./commands/handlers/apply-as-instructor.handler"
import { InstructorRepository } from "./repositories/instructor.repository"

@Module({
  controllers: [InstructorController],
  providers: [
    // Handlers
    ApplyAsInstructorHandler,

    // Repositories
    InstructorRepository,
  ],
})
export class InstructorModule {}
