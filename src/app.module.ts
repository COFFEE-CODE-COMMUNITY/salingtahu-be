import { Global, Module } from "@nestjs/common"
import { AuthModule } from "./modules/auth/auth.module"
import { ProviderUtil } from "./common/utils/provider.util"
import { InfrastructureModule } from "./infrastructure/infrastructure.module"
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core"
import { HttpRequestContextInterceptor } from "./common/http/http-request-context.interceptor"
import { HttpRequestContext } from "./common/http/http-request-context"
import { ValidationModule } from "./common/validators/validation.module"
import { UserModule } from "./modules/user/user.module"
import { QueueModule } from "./queue/queue.module"
import { StorageModule } from "./storage/storage.module"
import { InstructorModule } from "./modules/instructor/instructor.module"
import { HttpModule } from "@nestjs/axios"
import { BearerTokenGuard } from "./common/guards/bearer-token.guard"
import { RolesGuard } from "./common/guards/roles.guard"

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
  ],
  providers: [
    HttpRequestContext,
    ProviderUtil,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpRequestContextInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: BearerTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [HttpRequestContext],
})
export class AppModule {}
