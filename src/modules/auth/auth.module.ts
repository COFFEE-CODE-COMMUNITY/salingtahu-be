import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
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
import { ConfigModule } from "@nestjs/config"
import { TokensService } from "./services/tokens.service"
import { GoogleOAuth2Service } from "./services/google-oauth2.service"
import { GetGoogleAuthUrlHandler } from "./queries/handlers/get-google-auth-url.handler"
import { HttpModule } from "@nestjs/axios"
import { UserService } from "../user/services/user.service"
import { CqrsModule } from "@nestjs/cqrs"
import { GoogleOAuth2CallbackHandler } from "./commands/handlers/google-oauth2-callback.handler"
import { PasswordResetHandler } from "./commands/handlers/password-reset.handler"
import { PasswordResetService } from "./services/password-reset.service"

@Module({
  imports: [
    ConfigModule,
    CqrsModule,
    HttpModule.register({
      timeout: 10_000,
      maxRedirects: 5,
    }),
    UserModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    // Handlers
    RegisterHandler,
    LoginHandler,
    UserLoggedInHandler,
    GetGoogleAuthUrlHandler,
    GoogleOAuth2CallbackHandler,
    PasswordResetHandler,

    // Mappers
    AuthMapper,

    // Repositories
    OAuth2UserRepository,
    RefreshTokenRepository,

    // Services
    AccessTokenService,
    PasswordService,
    RefreshTokenService,
    TokensService,
    GoogleOAuth2Service,
    UserService,
    PasswordResetService,
  ],
  exports: [AccessTokenService],
})
export class AuthModule {}
