import { App } from "supertest/types"
import { Main } from "../src/main"
import { INestApplication } from "@nestjs/common"
import { Test, TestingModuleBuilder } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import { ConfigService } from "@nestjs/config"
import { randomBytes } from "crypto"
import { readFileSync } from "fs"
import { GLOBAL_CONFIG_PATH } from "./jest.global-setup"
import { GlobalConfig } from "./types/config"

const MINIO_ROOT_USER = "minioadmin"
const MINIO_ROOT_PASSWORD = "minioadmin"

class TestConfigService extends ConfigService {
  public constructor(internalConfig: Record<string, any>) {
    const globalConfig: GlobalConfig = JSON.parse(readFileSync(GLOBAL_CONFIG_PATH, "utf-8"))

    super({
      ...internalConfig,
      ...globalConfig.environment,
      DATABASE_TYPE: "postgres",
      ACCESS_TOKEN_SECRET: randomBytes(32).toString("hex"),
      S3_REGION: "us-east-1",
      S3_ENDPOINT: `http://${globalConfig.environment.MINIO_HOST}:${globalConfig.environment.MINIO_PORT}`,
      S3_BUCKET_NAME: "salingtau",
      S3_ACCESS_KEY: MINIO_ROOT_USER,
      S3_SECRET_KEY: MINIO_ROOT_PASSWORD,
    })
  }
}

export async function createTestApp(builder?: (builder: TestingModuleBuilder) => void): Promise<INestApplication<App>> {
  const testBuilder = Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(ConfigService)
    .useClass(TestConfigService)

  if (builder) {
    builder(testBuilder)
  }

  const moduleRef = await testBuilder.compile()
  const app = await Main.initializeApp(
    moduleRef.createNestApplication({
      bodyParser: false,
    }),
  )

  // Enable graceful shutdown for proper cleanup
  app.enableShutdownHooks()

  await app.init()

  return app
}
