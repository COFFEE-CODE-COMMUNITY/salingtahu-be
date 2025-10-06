import { Global, Module } from "@nestjs/common"
import { ConfigModule as NestConfigModule, ConfigService } from "@nestjs/config"
import { existsSync, readFileSync } from "fs"
import { resolve } from "path"
import _ from "lodash"
import { TypeOrmModule } from "@nestjs/typeorm"
import { NodeEnv } from "../common/enums/node-env"

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [resolve(".env")],
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
        }
      ],
    }),
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
export class InfrastructureModule {}