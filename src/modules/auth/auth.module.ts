import { Global, Module } from "@nestjs/common"
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
import { GoogleOAuth2Service } from "./services/google-oauth2.service"
import { GetGoogleAuthUrlHandler } from "./queries/handlers/get-google-auth-url.handler"
import { GoogleOAuth2CallbackHandler } from "./commands/handlers/google-oauth2-callback.handler"
import { PasswordResetHandler } from "./commands/handlers/password-reset.handler"
import { ChangePasswordHandler } from "./commands/handlers/change-password.handler"
import { LogoutHandler } from "./commands/handlers/logout.handler"
import { GetRefreshTokenHandler } from "./commands/handlers/get-refresh-token.handler"
import { PasswordResetSessionRepository } from "./repositories/password-reset-session.repository"
import { BullModule } from "@nestjs/bullmq"
import { IMAGE_PROCESSING_QUEUE } from "../../queue/image-processing.consumer"
import { NotSameAsCurrentPasswordConstraint } from "./validators/not-same-as-current-password.decorator"

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: IMAGE_PROCESSING_QUEUE
    }),
    UserModule
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
    ChangePasswordHandler,
    LogoutHandler,
    GetRefreshTokenHandler,

    // Mappers
    AuthMapper,

    // Repositories
    OAuth2UserRepository,
    PasswordResetSessionRepository,
    RefreshTokenRepository,

    // Services
    AccessTokenService,
    GoogleOAuth2Service,
    PasswordService,
    RefreshTokenService,
    GoogleOAuth2Service,

    // Validators
    NotSameAsCurrentPasswordConstraint
  ],
  exports: [AccessTokenService]
})
export class AuthModule {}
