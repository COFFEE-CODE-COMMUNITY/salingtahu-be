import { Module } from "@nestjs/common"
import { AuthController } from "./controllers/auth.controller"
import { RegisterHandler } from "./commands/handlers/register.handler"
import { PasswordService } from "./services/password.service"
import { AuthMapper } from "./mappers/auth.mapper"
import { UserModule } from "../user/user.module"
import { AccessTokenService } from "./services/access-token.service"

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    // Handlers
    RegisterHandler,

    // Mappers
    AuthMapper,

    // Services
    AccessTokenService,
    PasswordService,
  ],
  exports: [AccessTokenService],
})
export class AuthModule {}
