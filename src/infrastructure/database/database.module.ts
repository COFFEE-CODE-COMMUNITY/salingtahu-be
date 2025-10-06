import { Global, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigService } from "@nestjs/config"
import { NodeEnv } from "../../common/enums/node-env"

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
          password: config.getOrThrow<string>("DATABASE_HOST"),
          database: config.getOrThrow<string>("DATABASE_NAME"),
          synchronize: config.getOrThrow<NodeEnv>("NODE_ENV") == NodeEnv.DEVELOPMENT
        }
      },
      inject: [ConfigService]
    })
  ]
})
export class DatabaseModule {}