import { INestApplication } from "@nestjs/common"
import { App } from "supertest/types"
import { createTestApp } from "../create-test-app"
import { faker } from "@faker-js/faker"
import request from "supertest"
import { CommandBus } from "@nestjs/cqrs"
import { RegisterCommand } from "../../src/modules/auth/commands/register.command"
import { RegisterDto } from "../../src/modules/auth/dto/register.dto"
import { UserRepository } from "../../src/modules/user/repositories/user.repository"
import { OAuth2User } from "../../src/modules/auth/entities/oauth2-user.entity"
import { Oauth2Provider } from "../../src/modules/auth/enums/oauth2-provider.enum"
import { User } from "../../src/modules/user/entities/user.entity"
import _ from "lodash"

describe("POST /api/v1/auth/login", () => {
  let app: INestApplication<App>
  let userRepository: UserRepository
  let email: string
  let password: string

  beforeAll(async () => {
    app = await createTestApp()

    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    email = faker.internet.email()
    password = faker.internet.password({ length: 8 })

    const dto = new RegisterDto()
    dto.firstName = firstName
    dto.lastName = lastName
    dto.email = email
    dto.password = password

    const commandBus = app.get(CommandBus)
    await commandBus.execute(new RegisterCommand(dto))

    userRepository = app.get(UserRepository)

    const user = await userRepository.findByEmail(email)
    const oauth2User = new OAuth2User()
    oauth2User.provider = Oauth2Provider.GOOGLE
    oauth2User.providerUserId = "google-id"

    user!.oauth2Users = [oauth2User]
    await userRepository.save(user!)
  })

  afterAll(async () => {
    await app.close()
  })

  describe("200 OK", () => {
    it("should log in successfully with valid credentials", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/v1/auth/login")
        .send({
          email,
          password,
        })
        .set("User-Agent", faker.internet.userAgent())

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        refreshToken: expect.any(String),
        accessToken: expect.any(String)
      })
      expect(response.headers['set-cookie']![0]).toMatch(/refreshToken=.+;/)
    })
  })

  describe("401 Unauthorized", () => {
    it("should return 401 when email is not registered", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/auth/login")
        .send({
          email: faker.internet.email(),
          password
        })
        .set("User-Agent", faker.internet.userAgent())
        .expect(401)
        .expect({
          message: "Invalid credentials.",
        })
    })

    it("should return 401 when password is incorrect", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/auth/login")
        .send({
          email,
          password: faker.internet.password({ length: 8 }),
        })
        .set("User-Agent", faker.internet.userAgent())
        .expect(401)
        .expect({
          message: "Invalid credentials.",
        })
    })
  })

  describe("422 Unprocessable Entity", () => {
    it("should return 422 when user registered using oauth2", async () => {
      const user = new User()
      user.firstName = faker.person.firstName()
      user.lastName = faker.person.lastName()
      user.email = faker.internet.email()

      const oauth2User = new OAuth2User()
      oauth2User.provider = Oauth2Provider.GOOGLE
      oauth2User.providerUserId = faker.string.uuid()

      user.oauth2Users = [oauth2User]
      await userRepository.save(user)

      await request(app.getHttpServer())
        .post("/api/v1/auth/login")
        .send({
          email: user.email,
          password: user.password,
        })
        .set("User-Agent", faker.internet.userAgent())
        .expect(422)
        .expect({
          message: `Please logged in using ${user!.oauth2Users.map(oauth2User => _.startCase(oauth2User.provider.toLowerCase())).join(", ")}.`,
        })
    })
  })
})
