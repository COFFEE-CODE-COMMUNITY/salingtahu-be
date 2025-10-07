import { Module } from "@nestjs/common"
import { AuthModule } from "./modules/auth/auth.module"
import { ProviderUtil } from "./common/utils/provider.util"
import { InfrastructureModule } from "./infrastructure/infrastructure.module"
import { APP_INTERCEPTOR } from "@nestjs/core"
import { HttpRequestContextInterceptor } from "./common/http/http-request-context.interceptor"
import { HttpRequestContext } from "./common/http/http-request-context"

@Module({
  imports: [AuthModule, InfrastructureModule],
  providers: [
    HttpRequestContext,
    ProviderUtil,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpRequestContextInterceptor,
    },
  ],
})
export class AppModule {}
