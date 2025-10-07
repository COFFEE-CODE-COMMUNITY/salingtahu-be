import { Module } from "@nestjs/common"
import { AuthController } from "./controllers/auth.controller"
import { RegisterHandler } from "./commands/handlers/register.handler"
import { PasswordService } from "./services/password.service"
import { AuthMapper } from "./mappers/auth.mapper"
import { UserModule } from "../user/user.module"

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    // Handlers
    RegisterHandler,

    // Mappers
    AuthMapper,

    // Services
    PasswordService,
  ]
})
export class AuthModule {}