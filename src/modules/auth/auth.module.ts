import { Module } from "@nestjs/common"
import { AuthController } from "./controllers/auth.controller"
import { RegisterHandler } from "./commands/handlers/register.handler"
import { PasswordService } from "./services/password.service"
import { AuthMapper } from "./mappers/auth.mapper"
import { UserModule } from "../user/user.module"
import { AccessTokenService } from "./services/access-token.service"
import { LoginHandler } from "./commands/handlers/login.handler"
import { UserLoggedInHandler } from "./events/handlers/user-logged-in.handler"
import { OAuth2UserRepository } from "./repositories/oauth2-user.repository"
import { RefreshTokenRepository } from "./repositories/refresh-token.repository"
import { RefreshTokenService } from "./services/refresh-token.service"

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    // Handlers
    RegisterHandler,
    LoginHandler,
    UserLoggedInHandler,

    // Mappers
    AuthMapper,

    // Repositories
    OAuth2UserRepository,
    RefreshTokenRepository,

    // Services
    AccessTokenService,
    PasswordService,
    RefreshTokenService,
  ],
  exports: [AccessTokenService],
})
export class AuthModule {}
