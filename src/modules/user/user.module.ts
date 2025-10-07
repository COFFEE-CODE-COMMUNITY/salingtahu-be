import { Module } from "@nestjs/common"
import { UserRepository } from "./repositories/user.repository"

@Module({
  providers: [
    // Repositories
    UserRepository
  ],
  exports: [UserRepository]
})
export class UserModule {}