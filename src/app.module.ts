import { Global, Module } from "@nestjs/common"
import { AuthModule } from "./modules/auth/auth.module"
import { ProviderUtil } from "./common/utils/provider.util"
import { InfrastructureModule } from "./infrastructure/infrastructure.module"
import { APP_INTERCEPTOR } from "@nestjs/core"
import { HttpRequestContextInterceptor } from "./common/http/http-request-context.interceptor"
import { HttpRequestContext } from "./common/http/http-request-context"
import { ValidationModule } from "./common/validators/validation.module"
import { ConfigModule } from "@nestjs/config"
import { ForumModule } from "./modules/forum/forum.module"
import { UserModule } from "./modules/user/user.module"
import { QueueModule } from "./queue/queue.module"
import { StorageModule } from "./storage/storage.module"
import { InstructorModule } from "./modules/instructor/instructor.module"
import { HttpModule } from "@nestjs/axios"

@Global()
@Module({
  imports: [
    AuthModule,
    HttpModule.register({
      global: true,
    }),
    InfrastructureModule,
    InstructorModule,
    QueueModule,
    StorageModule,
    UserModule,
    ValidationModule,
    AuthModule,
    ForumModule,
  ],
  providers: [
    HttpRequestContext,
    ProviderUtil,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpRequestContextInterceptor,
    },
  ],
  exports: [HttpRequestContext],
})
export class AppModule {}
