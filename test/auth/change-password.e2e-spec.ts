import { INestApplication } from "@nestjs/common"
import { App } from "supertest/types"
import { createTestApp } from "../create-test-app"
import { mock, MockProxy } from "jest-mock-extended"
import { EmailService } from "@/email/email.service"
import request from "supertest"
import { UserDto } from "../../src/modules/user/dto/user.dto"
import { getAuthUser } from "../get-auth-user"
import { faker } from "@faker-js/faker"
import { RefreshTokenRepository } from "../../src/modules/auth/repositories/refresh-token.repository"

describe("POST /api/v1/auth/password-reset/change", () => {
  let app: INestApplication<App>
  let emailService: MockProxy<EmailService>
  let user: UserDto
  let userPassword: string

  beforeAll(async () => {
    emailService = mock<EmailService>()
    app = await createTestApp(builder => {
      builder.overrideProvider(EmailService).useValue(emailService)
    })

    const authUser = await getAuthUser(app)
    user = authUser.user
    userPassword = authUser.password
  })

  afterAll(async () => {
    await app.close()
  })

  describe("200 OK", () => {
    let token: string
    let currentPassword: string

    beforeEach(async () => {
      // Set a known current password first to ensure consistency across tests
      currentPassword = faker.internet.password({ length: 12 })

      emailService.send.mockImplementation((_, __, payload) => {
        const url = new URL(payload.payload.setPasswordUrl)
        token = url.searchParams.get("token")!
        return Promise.resolve()
      })

      // Get a password reset token
      await request(app.getHttpServer()).post("/api/v1/auth/password-reset").send({ email: user.email })

      // Change to the known current password
      await request(app.getHttpServer())
        .post("/api/v1/auth/password-reset/change")
        .query({ token })
        .send({ password: currentPassword, confirmPassword: currentPassword, logoutAll: false })

      // Get a fresh token for the actual test
      await request(app.getHttpServer()).post("/api/v1/auth/password-reset").send({ email: user.email })
    })

    it("should change the password successfully", async () => {
      const password = faker.internet.password({ length: 12 })
      const response = await request(app.getHttpServer())
        .post("/api/v1/auth/password-reset/change")
        .query({ token })
        .send({ password, confirmPassword: password, logoutAll: false })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        message: "Password changed successfully."
      })
    })

    it("should change the password and logout all sessions successfully", async () => {
      const password = faker.internet.password({ length: 12 })

      // Create multiple sessions with the current password
      for (let i = 0; i < 2; i++) {
        const loginResponse = await request(app.getHttpServer())
          .post("/api/v1/auth/login")
          .send({ email: user.email, password: currentPassword })
          .set("User-Agent", faker.internet.userAgent())

        expect(loginResponse.status).toBe(200)
      }

      await request(app.getHttpServer())
        .post("/api/v1/auth/password-reset/change")
        .query({ token })
        .send({ password, confirmPassword: password, logoutAll: true })
        .expect(200)
        .expect({
          message: "Password changed successfully."
        })

      const refreshTokenRepository = app.get(RefreshTokenRepository)
      const refreshTokens = await refreshTokenRepository.findActiveByUserId(user.id)

      expect(refreshTokens.length).toBe(0)
    })
  })

  describe("400 Bad Request", () => {
    let token: string
    let currentPassword: string

    beforeEach(async () => {
      // Set a known current password first to ensure consistency
      currentPassword = faker.internet.password({ length: 12 })

      // Get a password reset token
      emailService.send.mockImplementation((_, __, payload) => {
        const url = new URL(payload.payload.setPasswordUrl)
        token = url.searchParams.get("token")!
        return Promise.resolve()
      })

      await request(app.getHttpServer()).post("/api/v1/auth/password-reset").send({ email: user.email })

      // Change to the known current password
      await request(app.getHttpServer())
        .post("/api/v1/auth/password-reset/change")
        .query({ token })
        .send({ password: currentPassword, confirmPassword: currentPassword, logoutAll: false })

      // Get a fresh token for the actual test
      await request(app.getHttpServer()).post("/api/v1/auth/password-reset").send({ email: user.email })
    })

    it("should return 400 if confirmPassword do not match", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/v1/auth/password-reset/change")
        .query({ token: "some-token" })
        .send({
          password: faker.internet.password({ length: 12 }),
          confirmPassword: faker.internet.password({ length: 12 }),
          logoutAll: false
        })
        .expect(400)

      expect(response.body.errors.confirmPassword).toContain("Confirm password must match password")
    })

    it("should return 400 if password is same as old password", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/v1/auth/password-reset/change")
        .query({ token })
        .send({ password: currentPassword, confirmPassword: currentPassword, logoutAll: false })
        .expect(400)

      expect(response.body.errors.password).toContain("New password must not be the same as the current password.")
    })
  })

  describe("401 Unauthorized", () => {
    it("should return 401 if token is invalid", async () => {
      const password = faker.internet.password({ length: 12 })
      await request(app.getHttpServer())
        .post("/api/v1/auth/password-reset/change")
        .query({ token: "invalid-token" })
        .send({ password, confirmPassword: password, logoutAll: false })
        .expect(401)
        .expect({
          message: "Invalid or expired password reset token."
        })
    })
  })
})
