import { INestApplication } from "@nestjs/common"
import { App } from "supertest/types"
import { createTestApp } from "../create-test-app"
import request from "supertest"

describe("POST /api/v1/auth/google", () => {
  let app: INestApplication<App>

  beforeAll(async () => {
    app = await createTestApp()
  })

  afterAll(async () => {
    await app.close()
  })

  describe("200 OK", () => {
    it("should return Google OAuth2 URL", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/auth/google")
        .expect(200)

      expect(response.body.url).toContain("accounts.google.com")
    })
  })
})
