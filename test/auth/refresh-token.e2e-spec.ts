import { INestApplication } from "@nestjs/common"
import { App } from "supertest/types"
import { createTestApp } from "../create-test-app"
import { getAuthUser, GetAuthUserResult } from "../get-auth-user"
import request from "supertest"
import { faker } from "@faker-js/faker"
import { REFRESH_TOKEN_COOKIE_NAME } from "../../src/modules/auth/constants/cookie-name.constant"

describe("GET /api/v1/auth/refresh-token", () => {
  let app: INestApplication<App>
  let authUser: GetAuthUserResult

  beforeAll(async () => {
    app = await createTestApp()
    authUser = await getAuthUser(app)
  })

  afterAll(async () => {
    await app.close()
  })

  describe("200 OK", () => {
    it("should refresh tokens successfully using cookie", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/auth/refresh-token")
        .set("User-Agent", authUser.userAgent)
        .set("Cookie", `${REFRESH_TOKEN_COOKIE_NAME}=${authUser.refreshToken}`)
        .expect(200)

      expect(response.body).toHaveProperty("accessToken")
      expect(response.body).toHaveProperty("refreshToken")
      expect(typeof response.body.accessToken).toBe("string")
      expect(typeof response.body.refreshToken).toBe("string")
      // Note: access token might be the same if generated within the same second
      expect(response.body.refreshToken).not.toBe(authUser.refreshToken)
    })

    it("should allow using the new refresh token after refresh", async () => {
      // Get a fresh auth user for this test
      const freshAuthUser = await getAuthUser(app)

      // First refresh
      const firstResponse = await request(app.getHttpServer())
        .get("/api/v1/auth/refresh-token")
        .set("User-Agent", freshAuthUser.userAgent)
        .set("Cookie", `${REFRESH_TOKEN_COOKIE_NAME}=${freshAuthUser.refreshToken}`)
        .expect(200)

      const newRefreshToken = firstResponse.body.refreshToken

      // Second refresh with the new token
      const secondResponse = await request(app.getHttpServer())
        .get("/api/v1/auth/refresh-token")
        .set("User-Agent", freshAuthUser.userAgent)
        .set("Cookie", `${REFRESH_TOKEN_COOKIE_NAME}=${newRefreshToken}`)
        .expect(200)

      expect(secondResponse.body).toHaveProperty("accessToken")
      expect(secondResponse.body).toHaveProperty("refreshToken")
      expect(secondResponse.body.refreshToken).not.toBe(newRefreshToken)
    })

    it("should be able to access protected endpoints with new access token", async () => {
      // Get a fresh auth user for this test
      const freshAuthUser = await getAuthUser(app)

      const refreshResponse = await request(app.getHttpServer())
        .get("/api/v1/auth/refresh-token")
        .set("User-Agent", freshAuthUser.userAgent)
        .set("Cookie", `${REFRESH_TOKEN_COOKIE_NAME}=${freshAuthUser.refreshToken}`)
        .expect(200)

      const newAccessToken = refreshResponse.body.accessToken

      // Use the new access token to access a protected endpoint
      const userResponse = await request(app.getHttpServer())
        .get("/api/v1/users/me")
        .set("Authorization", `Bearer ${newAccessToken}`)
        .expect(200)

      expect(userResponse.body).toHaveProperty("email")
      expect(userResponse.body.email).toBe(freshAuthUser.user.email)
    })
  })

  describe("401 Unauthorized", () => {
    it("should return 401 if refresh token cookie is missing", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/auth/refresh-token")
        .set("User-Agent", authUser.userAgent)
        .expect(401)

      expect(response.body).toHaveProperty("message")
      expect(response.body.message).toBe("Invalid refresh token.")
    })

    it("should return 401 if refresh token is invalid", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/auth/refresh-token")
        .set("User-Agent", authUser.userAgent)
        .set("Cookie", `${REFRESH_TOKEN_COOKIE_NAME}=invalid-token`)
        .expect(401)

      expect(response.body).toHaveProperty("message")
      expect(response.body.message).toBe("Invalid refresh token.")
    })

    it("should return 401 if refresh token has already been used", async () => {
      // Get a fresh auth user for this test
      const freshAuthUser = await getAuthUser(app)

      // First refresh - should succeed
      await request(app.getHttpServer())
        .get("/api/v1/auth/refresh-token")
        .set("User-Agent", freshAuthUser.userAgent)
        .set("Cookie", `${REFRESH_TOKEN_COOKIE_NAME}=${freshAuthUser.refreshToken}`)
        .expect(200)

      // Second refresh with the same token - should fail
      const response = await request(app.getHttpServer())
        .get("/api/v1/auth/refresh-token")
        .set("User-Agent", freshAuthUser.userAgent)
        .set("Cookie", `${REFRESH_TOKEN_COOKIE_NAME}=${freshAuthUser.refreshToken}`)
        .expect(401)

      expect(response.body).toHaveProperty("message")
      expect(response.body.message).toBe("Invalid refresh token.")
    })

    it("should return 401 if User-Agent header is different", async () => {
      // Get a fresh auth user for this test
      const freshAuthUser = await getAuthUser(app)
      const differentUserAgent = faker.internet.userAgent()

      const response = await request(app.getHttpServer())
        .get("/api/v1/auth/refresh-token")
        .set("User-Agent", differentUserAgent)
        .set("Cookie", `${REFRESH_TOKEN_COOKIE_NAME}=${freshAuthUser.refreshToken}`)
        .expect(401)

      expect(response.body).toHaveProperty("message")
      expect(response.body.message).toBe("Invalid refresh token.")
    })
  })

  describe("400 Bad Request", () => {
    it("should return 400 if User-Agent header is missing", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/auth/refresh-token")
        .set("Cookie", `${REFRESH_TOKEN_COOKIE_NAME}=${authUser.refreshToken}`)
        .expect(400)

      expect(response.body).toHaveProperty("message")
    })
  })
})
