import { Global, Module } from "@nestjs/common"
import { ConfigModule as NestConfigModule, ConfigService } from "@nestjs/config"
import { existsSync, readFileSync } from "fs"
import { resolve } from "path"
import { TypeOrmModule } from "@nestjs/typeorm"
import { NodeEnv } from "../common/enums/node-env"
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
import _ from "lodash"
import { Resend } from "resend"
import { User } from "../modules/user/entities/user.entity"
import { TextHasher } from "./security/cryptography/text-hasher"
import { Sha256TextHasher } from "./security/cryptography/sha256-text-hasher"
import { RefreshToken } from "../modules/auth/entities/refresh-token.entity"
import { OAuth2User } from "../modules/auth/entities/oauth2-user.entity"
import { RedisService } from "./cache/redis.service"
import { Cache } from "./cache/cache"
import { Thread } from "../modules/forum/entities/thread.entity"
import { Reply } from "../modules/forum/entities/reply.entity"
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
          },
        }
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: EMAIL_QUEUE,
    }),
    CqrsModule.forRoot(),
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env"],
      load: [
        (): any => {
          const env = process.env.NODE_ENV || "development"
          const defaultConfigPath = resolve("app-config.json")
          const envConfigPath = resolve(`app-config.${env}.json`)
          let config = JSON.parse(readFileSync(defaultConfigPath, "utf-8"))

          if (existsSync(envConfigPath)) {
            const envConfig = JSON.parse(readFileSync(envConfigPath, "utf-8"))
            config = _.merge(config, envConfig)
          }

          return config
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      useFactory(config: ConfigService) {
        return {
          type: config.getOrThrow<"postgres">("DATABASE_TYPE"),
          host: config.getOrThrow<string>("DATABASE_HOST"),
          port: parseInt(config.getOrThrow<string>("DATABASE_PORT")),
          username: config.getOrThrow<string>("DATABASE_USERNAME"),
          password: config.getOrThrow<string>("DATABASE_PASSWORD"),
          database: config.getOrThrow<string>("DATABASE_NAME"),
          synchronize: config.get<NodeEnv>("NODE_ENV", NodeEnv.DEVELOPMENT) != NodeEnv.PRODUCTION,
          entities: [OAuth2User, RefreshToken, User, Thread, Reply],
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
          db: 0,
        })
      },
      inject: [ConfigService],
    },
    Cache,
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
  exports: [Logger, UnitOfWork, TextHasher, EmailService, TransactionContextService, RedisService, Cache],
})
export class InfrastructureModule {}
