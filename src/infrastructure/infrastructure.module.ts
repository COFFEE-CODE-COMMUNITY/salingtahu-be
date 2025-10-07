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
import Redis from "ioredis"
import { Resend } from "resend"
import { User } from "../modules/user/entities/user.entity"

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
          synchronize: config.get<NodeEnv>("NODE_ENV", NodeEnv.DEVELOPMENT) == NodeEnv.DEVELOPMENT,
          entities: [User],
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
      provide: Redis,
      useFactory(config: ConfigService) {
        return new Redis({
          host: config.getOrThrow<string>("REDIS_HOST"),
          port: parseInt(config.getOrThrow<string>("REDIS_PORT"), 10),
        })
      },
      inject: [ConfigService],
    },
    {
      provide: Resend,
      useFactory(config: ConfigService) {
        return new Resend(config.getOrThrow<string>("RESEND_API_KEY"))
      },
      inject: [ConfigService],
    },
  ],
})
export class InfrastructureModule {}
