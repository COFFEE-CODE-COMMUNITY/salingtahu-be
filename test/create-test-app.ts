import { App } from "supertest/types"
import { Main } from "../src/main"
import { INestApplication } from "@nestjs/common"
import { Test, TestingModuleBuilder } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql"
import { RedisContainer, StartedRedisContainer } from "@testcontainers/redis"
import { ConfigService  } from "@nestjs/config"

let postgresqlContainer: StartedPostgreSqlContainer | null = null
let redisContainer: StartedRedisContainer | null = null

export async function setupTestContainers() {
  if (!postgresqlContainer) {
    postgresqlContainer = await new PostgreSqlContainer("postgres:17").start()
  }
  if (!redisContainer) {
    redisContainer = await new RedisContainer("redis:8.2.1").start()
  }
}

export async function teardownTestContainers() {
  if (postgresqlContainer) {
    await postgresqlContainer.stop()
    postgresqlContainer = null
  }
  if (redisContainer) {
    await redisContainer.stop()
    redisContainer = null
  }
}

class TestConfigService extends ConfigService {
  public constructor(internalConfig: Record<string, any>) {
    super({
      ...internalConfig,
      DATABASE_HOST: postgresqlContainer!.getHost(),
      DATABASE_PORT: postgresqlContainer!.getPort().toString(),
      DATABASE_USERNAME: postgresqlContainer!.getUsername(),
      DATABASE_PASSWORD: postgresqlContainer!.getPassword(),
      DATABASE_NAME: postgresqlContainer!.getDatabase(),
      REDIS_HOST: redisContainer!.getHost(),
      REDIS_PORT: redisContainer!.getPort().toString(),
    })
  }
}

export async function createTestApp(
  builder?: (builder: TestingModuleBuilder) => TestingModuleBuilder,
): Promise<INestApplication<App>> {
  await setupTestContainers()

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

  await app.init()

  return app
}
