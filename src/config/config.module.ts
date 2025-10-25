import { Global, Module } from "@nestjs/common"
import { ConfigModule as NestConfigModule } from "@nestjs/config"
import { existsSync, readFileSync } from "fs"
import { resolve } from "path"
import { InfisicalSDK } from "@infisical/sdk"
import _ from "lodash"

async function loadInfisicalSecret(): Promise<Record<string, any>> {
  const infisicalClientId = process.env.INFISICAL_CLIENT_ID
  const infisicalClientSecret = process.env.INFISICAL_CLIENT_SECRET
  const infisicalUrl = process.env.INFISICAL_URL
  const infisicalProjectId = process.env.INFISICAL_PROJECT_ID

  if (!infisicalClientId || !infisicalClientSecret || !infisicalUrl || !infisicalProjectId) {
    return {}
  }

  const infisical = new InfisicalSDK({
    siteUrl: infisicalUrl,
  })

  await infisical.auth().universalAuth.login({
    clientId: infisicalClientId,
    clientSecret: infisicalClientSecret,
  })

  const allSecrets = await infisical.secrets().listSecrets({
    environment: process.env.NODE_ENV || "development",
    projectId: infisicalProjectId,
  })

  return allSecrets.secrets.reduce(
    (acc, secret) => {
      acc[secret.secretKey] = secret.secretValue
      return acc
    },
    {} as Record<string, any>,
  )
}

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env"],
      load: [
        async (): Promise<any> => {
          const env = process.env.NODE_ENV || "development"
          const defaultConfigPath = resolve("app-config.json")
          const envConfigPath = resolve(`app-config.${env}.json`)
          let config = JSON.parse(readFileSync(defaultConfigPath, "utf-8"))

          if (existsSync(envConfigPath)) {
            const envConfig = JSON.parse(readFileSync(envConfigPath, "utf-8"))
            config = _.merge(config, envConfig)
          }

          config = _.merge(config, await loadInfisicalSecret())

          return config
        },
      ],
    }),
  ],
})
export class ConfigModule {}
