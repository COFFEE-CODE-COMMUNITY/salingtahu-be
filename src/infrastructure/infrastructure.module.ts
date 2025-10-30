import { Global, Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { TransactionContextService } from "./database/unit-of-work/transaction-context.service"
import { UnitOfWork } from "./database/unit-of-work/unit-of-work"
import { Logger } from "./log/logger.abstract"
import { WinstonLogger } from "./log/winston.logger"
import { AutomapperModule } from "@automapper/nestjs"
import { classes } from "@automapper/classes"
import { CqrsModule } from "@nestjs/cqrs"
import { BullModule } from "@nestjs/bullmq"
import { EmailService } from "./email/email.service"
import { EMAIL_QUEUE, EmailConsumer } from "./email/email.consumer"
import { Resend } from "resend"
import { User } from "../modules/user/entities/user.entity"
import { TextHasher } from "./security/cryptography/text-hasher"
import { Sha256TextHasher } from "./security/cryptography/sha256-text-hasher"
import { RefreshToken } from "../modules/auth/entities/refresh-token.entity"
import { OAuth2User } from "../modules/auth/entities/oauth2-user.entity"
import { RedisService } from "./cache/redis.service"
import _ from "lodash"
import { Cache } from "./cache/cache"
import { Thread } from "../modules/forum/entities/thread.entity"
import { Reply } from "../modules/forum/entities/reply.entity"
import { PasswordResetSession } from "../modules/auth/entities/password-reset-session.entity"
import { InstructorVerification } from "../modules/user/entities/instructor-verification.entity"

@Global()
@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    BullModule.forRootAsync({
      useFactory(config: ConfigService) {
        return {
          connection: {
            host: config.getOrThrow<string>("REDIS_HOST"),
            port: parseInt(config.getOrThrow<string>("REDIS_PORT"), 10),
            db: 1,
          },
        }
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: EMAIL_QUEUE,
    }),
    CqrsModule.forRoot(),
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
          entities: [OAuth2User, PasswordResetSession, RefreshToken, User, InstructorVerification, Thread, Reply],
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    EmailConsumer,
    EmailService,
    TransactionContextService,
    UnitOfWork,
    Cache,
    {
      provide: Logger,
      useClass: WinstonLogger,
    },
    {
      provide: RedisService,
      useFactory(config: ConfigService): RedisService {
        return new RedisService({
          host: config.getOrThrow("REDIS_HOST"),
          port: config.getOrThrow("REDIS_PORT"),
        })
      },
      inject: [ConfigService],
    },
    {
      provide: Resend,
      useFactory(config: ConfigService): Resend {
        return new Resend(config.getOrThrow<string>("RESEND_API_KEY"))
      },
      inject: [ConfigService],
    },
    {
      provide: TextHasher,
      useClass: Sha256TextHasher,
    },
  ],
  exports: [Logger, UnitOfWork, TextHasher, EmailService, TransactionContextService, Cache],
})
export class InfrastructureModule {}
