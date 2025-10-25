import { INestApplication } from '@nestjs/common'
import { App } from 'supertest/types'
import { createTestApp } from '../create-test-app'
import { faker } from '@faker-js/faker'
import request from 'supertest'

describe("POST /api/v1/auth/register", () => {
  let app: INestApplication<App>

  beforeAll(async () => {
    app = await createTestApp()
  })

  afterAll(async () => {
    await app.close()
  })

  describe("201 Created", () => {
    it("should create a new user and respond with 201", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/v1/auth/register")
        .send({
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          password: faker.internet.password({ length: 8 }),
        })

      expect(response.status).toBe(201)
      expect(response.body.message).toBe("User successfully registered.")
    })
  })

  describe("400 Bad Request", () => {
    describe("firstName validation", () => {
      it("should return 400 when firstName is missing", async () => {
        await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 8 }),
          })
          .expect(400)
          .expect(res => {
            expect(res.body.message).toBe("Validation Failed")
            expect(res.body.errors.firstName).toContain("First name should not be empty")
          })
      })

      it("should return 400 when firstName is not a string", async () => {
        await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            firstName: 123,
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 8 }),
          })
          .expect(400)
          .expect(res => {
            expect(res.body.message).toBe("Validation Failed")
            expect(res.body.errors.firstName).toContain("First name must be a string")
          })
      })

      it("should return 400 when firstName is too short", async () => {
        await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            firstName: "J",
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 8 }),
          })
          .expect(400)
          .expect(res => {
            expect(res.body.message).toBe("Validation Failed")
            expect(res.body.errors.firstName).toContain("First name must be at least 2 characters long")
          })
      })

      it("should return 400 when firstName is too long", async () => {
        await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            firstName: "J".repeat(31),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 8 }),
          })
          .expect(400)
          .expect(res => {
            expect(res.body.message).toBe("Validation Failed")
            expect(res.body.errors.firstName).toContain("First name must be at most 30 characters long")
          })
      })
    })

    describe("lastName validation", () => {
      it("should return 400 when lastName is missing", async () => {
        await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            firstName: faker.person.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 8 }),
          })
          .expect(400)
          .expect(res => {
            expect(res.body.message).toBe("Validation Failed")
            expect(res.body.errors.lastName).toContain("Last name should not be empty")
          })
      })

      it("should return 400 when lastName is not a string", async () => {
        await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            firstName: faker.person.firstName(),
            lastName: 123,
            email: faker.internet.email(),
            password: faker.internet.password({ length: 8 }),
          })
          .expect(400)
          .expect(res => {
            expect(res.body.message).toBe("Validation Failed")
            expect(res.body.errors.lastName).toContain("Last name must be a string")
          })
      })

      it("should return 400 when lastName is too short", async () => {
        await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            firstName: faker.person.firstName(),
            lastName: "D",
            email: faker.internet.email(),
            password: faker.internet.password({ length: 8 }),
          })
          .expect(400)
          .expect(res => {
            expect(res.body.message).toBe("Validation Failed")
            expect(res.body.errors.lastName).toContain("Last name must be at least 2 characters long")
          })
      })

      it("should return 400 when lastName is too long", async () => {
        await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            firstName: faker.person.firstName(),
            lastName: "D".repeat(31),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 8 }),
          })
          .expect(400)
          .expect(res => {
            expect(res.body.message).toBe("Validation Failed")
            expect(res.body.errors.lastName).toContain("Last name must be at most 30 characters long")
          })
      })
    })

    describe("email validation", () => {
      it("should return 400 when email is missing", async () => {
        await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            password: faker.internet.password({ length: 8 }),
          })
          .expect(400)
          .expect(res => {
            expect(res.body.message).toBe("Validation Failed")
            expect(res.body.errors.email).toContain("Email should not be empty")
          })
      })

      it("should return 400 when email is not a string", async () => {
        await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: 12345,
            password: faker.internet.password({ length: 8 }),
          })
          .expect(400)
          .expect(res => {
            expect(res.body.message).toBe("Validation Failed")
            expect(res.body.errors.email).toContain("Email must be a string")
          })
      })

      it("should return 400 when email format is invalid", async () => {
        await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: "invalid-email",
            password: faker.internet.password({ length: 8 }),
          })
          .expect(400)
          .expect(res => {
            expect(res.body.message).toBe("Validation Failed")
            expect(res.body.errors.email).toContain("Invalid email format")
          })
      })

      it("should return 400 when email is too long", async () => {
        await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: "a".repeat(50) + "@example.com",
            password: faker.internet.password({ length: 8 }),
          })
          .expect(400)
          .expect(res => {
            expect(res.body.message).toBe("Validation Failed")
            expect(res.body.errors.email).toContain("Email must be at most 50 characters long")
          })
      })

      it("should return 400 when email already exists", async () => {
        const existingEmail = faker.internet.email()

        // Create a user first
        await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: existingEmail,
            password: faker.internet.password({ length: 8 }),
          })
          .expect(201)

        // Try to create another user with the same email
        await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: existingEmail,
            password: faker.internet.password({ length: 8 }),
          })
          .expect(400)
          .expect(res => {
            expect(res.body.message).toBe("Validation Failed")
            expect(res.body.errors.email).toContain("Email already in use")
          })
      })
    })

    describe("password validation", () => {
      it("should return 400 when password is missing", async () => {
        await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
          })
          .expect(400)
          .expect(res => {
            expect(res.body.message).toBe("Validation Failed")
            expect(res.body.errors.password).toContain("Password should not be empty")
          })
      })

      it("should return 400 when password is not a string", async () => {
        await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: 12345678,
          })
          .expect(400)
          .expect(res => {
            expect(res.body.message).toBe("Validation Failed")
            expect(res.body.errors.password).toContain("Password must be a string")
          })
      })

      it("should return 400 when password is too short", async () => {
        await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: "short",
          })
          .expect(400)
          .expect(res => {
            expect(res.body.message).toBe("Validation Failed")
            expect(res.body.errors.password).toContain("Password must be at least 8 characters long")
          })
      })

      it("should return 400 when password is too long", async () => {
        await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: "p".repeat(101),
          })
          .expect(400)
          .expect(res => {
            expect(res.body.message).toBe("Validation Failed")
            expect(res.body.errors.password).toContain("Password must be at most 100 characters long")
          })
      })
    })

    describe("multiple field validation errors", () => {
      it("should return 400 with multiple errors when multiple fields are invalid", async () => {
        await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({
            firstName: "J",
            lastName: "D",
            email: "invalid-email",
            password: "short",
          })
          .expect(400)
          .expect(res => {
            expect(res.body.message).toBe("Validation Failed")
            expect(res.body.errors.firstName).toBeDefined()
            expect(res.body.errors.lastName).toBeDefined()
            expect(res.body.errors.email).toBeDefined()
            expect(res.body.errors.password).toBeDefined()
          })
      })

      it("should return 400 when all fields are missing", async () => {
        await request(app.getHttpServer())
          .post("/api/v1/auth/register")
          .send({})
          .expect(400)
          .expect(res => {
            expect(res.body.message).toBe("Validation Failed")
            expect(res.body.errors.firstName).toContain("First name should not be empty")
            expect(res.body.errors.lastName).toContain("Last name should not be empty")
            expect(res.body.errors.email).toContain("Email should not be empty")
            expect(res.body.errors.password).toContain("Password should not be empty")
          })
      })
    })
  })
})
