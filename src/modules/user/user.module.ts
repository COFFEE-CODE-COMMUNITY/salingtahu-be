import { Module } from "@nestjs/common"
import { UserRepository } from "./repositories/user.repository"
import { UserController } from "./controllers/user.controller"

@Module({
  controllers: [UserController],
  providers: [
    // Repositories
    UserRepository,
  ],
  exports: [UserRepository],
})
export class UserModule {}
