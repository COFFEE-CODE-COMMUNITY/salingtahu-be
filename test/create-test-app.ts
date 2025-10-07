import { App } from 'supertest/types'
import { Main } from '../src/main'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModuleBuilder } from '@nestjs/testing'
import { AppModule } from '../src/app.module'

export async function createTestApp(
  builder?: (builder: TestingModuleBuilder) => TestingModuleBuilder,
): Promise<INestApplication<App>> {
  const testBuilder = Test.createTestingModule({
    imports: [AppModule],
  })

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
