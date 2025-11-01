import { Global, Module } from "@nestjs/common"
import { AuthModule } from "./modules/auth/auth.module"
import { ProviderUtil } from "./utils/provider.util"
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core"
import { HttpRequestContextInterceptor } from "./http/http-request-context.interceptor"
import { HttpRequestContext } from "./http/http-request-context"
import { ValidationModule } from "./validators/validation.module"
import { UserModule } from "./modules/user/user.module"
import { QueueModule } from "./queue/queue.module"
import { StorageModule } from "./storage/storage.module"
import { HttpModule } from "@nestjs/axios"
import { BearerTokenGuard } from "./guards/bearer-token.guard"
import { RolesGuard } from "./guards/roles.guard"
import { ConfigModule } from "./config/config.module"
import { ServiceModule } from "./services/service.module"
import { WebhookModule } from "./modules/webhook/webhook.module"
import { DatabaseModule } from "./database/database.module"
import { CacheModule } from "./cache/cache.module"
import { AutomapperModule } from "@automapper/nestjs"
import { classes } from "@automapper/classes"
import { BullModule } from "@nestjs/bullmq"
import { ConfigService } from "@nestjs/config"
import { CqrsModule } from "@nestjs/cqrs"
import { EmailModule } from "./email/email.module"
import { SecurityModule } from "./security/security.module"
import { LogModule } from "./log/log.module"

@Global()
@Module({
  imports: [
    AuthModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes()
    }),
    BullModule.forRootAsync({
      useFactory(config: ConfigService) {
        return {
          connection: {
            host: config.getOrThrow<string>("REDIS_HOST"),
            port: parseInt(config.getOrThrow<string>("REDIS_PORT"), 10),
            db: 1
          }
        }
      },
      inject: [ConfigService]
    }),
    CacheModule,
    ConfigModule,
    CqrsModule.forRoot(),
    DatabaseModule,
    EmailModule,
    HttpModule.register({
      global: true
    }),
    LogModule,
    QueueModule,
    SecurityModule,
    ServiceModule,
    StorageModule,
    UserModule,
    ValidationModule,
    WebhookModule
  ],
  providers: [
    HttpRequestContext,
    ProviderUtil,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpRequestContextInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: BearerTokenGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
  exports: [HttpRequestContext]
})
export class AppModule {}
