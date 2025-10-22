import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { CqrsModule } from "@nestjs/cqrs"
import { HttpModule } from "@nestjs/axios"
import { UserModule } from "../user/user.module"
import { JwtModule } from "@nestjs/jwt"

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
  providers: [

  ],
})
export class ForumModule {}
