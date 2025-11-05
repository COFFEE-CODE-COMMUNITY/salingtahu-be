import { Global, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigService } from "@nestjs/config"
import { OAuth2User } from "../modules/auth/entities/oauth2-user.entity"
import { PasswordResetSession } from "../modules/auth/entities/password-reset-session.entity"
import { RefreshToken } from "../modules/auth/entities/refresh-token.entity"
import { User } from "../modules/user/entities/user.entity"
import { InstructorVerification } from "../modules/user/entities/instructor-verification.entity"
import { TransactionContextService } from "./unit-of-work/transaction-context.service"
import { UnitOfWork } from "./unit-of-work/unit-of-work"

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory(config: ConfigService) {
        return {
          type: config.getOrThrow<"postgres">("DATABASE_TYPE"),
          host: config.getOrThrow<string>("DATABASE_HOST"),
          port: parseInt(config.getOrThrow<string>("DATABASE_PORT")),
          username: config.getOrThrow<string>("DATABASE_USERNAME"),
          password: config.getOrThrow<string>("DATABASE_PASSWORD"),
          database: config.getOrThrow<string>("DATABASE_NAME"),
          // synchronize: config.get<NodeEnv>("NODE_ENV", NodeEnv.DEVELOPMENT) != NodeEnv.PRODUCTION,
          synchronize: true,
          entities: [OAuth2User, PasswordResetSession, RefreshToken, User, InstructorVerification]
        }
      },
      inject: [ConfigService]
    })
  ],
  providers: [TransactionContextService, UnitOfWork],
  exports: [TransactionContextService, UnitOfWork]
})
export class DatabaseModule {}
