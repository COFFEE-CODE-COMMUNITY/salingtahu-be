import { INestApplication } from "@nestjs/common"
import { createTestApp } from "../create-test-app"
import { App } from "supertest/types"
import { getAuthUser } from "../get-auth-user"
import { UserDto } from "../../src/modules/user/dto/user.dto"
import { MockProxy, mock } from "jest-mock-extended"
import { EmailService } from "@/email/email.service"
import { faker } from "@faker-js/faker"
import request from "supertest"

describe("POST /api/v1/auth/password-reset", () => {
  let emailService: MockProxy<EmailService>
  let app: INestApplication<App>
  let user: UserDto

  beforeAll(async () => {
    emailService = mock<EmailService>()
    app = await createTestApp(builder => {
      builder.overrideProvider(EmailService).useValue(emailService)
    })
    user = await getAuthUser(app).then(result => result.user)
  })

  afterAll(async () => {
    await app.close()
  })

  describe("200 OK", () => {
    it("should send password reset email", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/auth/password-reset")
        .send({ email: user.email })
        .expect(200)
        .expect({
          message: "A verification code has been sent to the email. Please check your inbox or spam mail."
        })

      expect(emailService.send).toHaveBeenCalledTimes(1)
      expect(emailService.send).toHaveBeenCalledWith(
        user.email,
        "Password Reset Request",
        expect.objectContaining({
          name: "password-reset",
          payload: expect.objectContaining({
            setPasswordUrl: expect.any(String)
          })
        })
      )
    })
  })

  describe("400 Bad Request", () => {
    it("should response 400 if email not found", async () => {
      const nonExistentEmail = faker.internet.email()
      const response = await request(app.getHttpServer())
        .post("/api/v1/auth/password-reset")
        .send({ email: nonExistentEmail })
        .expect(400)

      expect(response.body.errors.email).toContain("Email does not exists")
      expect(emailService.send).not.toHaveBeenCalledTimes(2)
    })
  })
})
