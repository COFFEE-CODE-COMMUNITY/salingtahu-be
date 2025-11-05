import { INestApplication } from "@nestjs/common"
import { App } from "supertest/types"
import { createTestApp } from "../create-test-app"
import { getAuthUser } from "../get-auth-user"
import { readFile } from "fs/promises"
import request from "supertest"

describe("PUT /api/v1/users/me/profile-picture", () => {
  let app: INestApplication<App>
  let accessToken: string

  beforeAll(async () => {
    app = await createTestApp()

    const authUser = await getAuthUser(app)
    accessToken = authUser.accessToken
  })

  afterAll(async () => {
    await app.close()
  }, 60_000)

  describe("200 OK", () => {
    it.each([
      {
        sampleImagePath: "test/fixtures/images/image.jpg",
        mimeType: "image/jpeg"
      },
      {
        sampleImagePath: "test/fixtures/images/image.png",
        mimeType: "image/png"
      },
      {
        sampleImagePath: "test/fixtures/images/image.webp",
        mimeType: "image/webp"
      },
      {
        sampleImagePath: "test/fixtures/images/image.avif",
        mimeType: "image/avif"
      },
      {
        sampleImagePath: "test/fixtures/images/image.heic",
        mimeType: "image/heic"
      }
    ])("should update profile picture with $mimeType image", async ({ sampleImagePath, mimeType }) => {
      const imageBuffer = await readFile(sampleImagePath)
      await request(app.getHttpServer())
        .put("/api/v1/users/me/profile-picture")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("Content-Type", mimeType)
        .send(imageBuffer)
        .expect(200)
        .expect({
          message: "Profile picture updated successfully."
        })
    })
  })

  // We're cannot test the client error because supertest throw error when the request stream is destroyed
  // describe("401 Unauthorized", () => {
  //   it("should return 401 when no authentication token is provided", async () => {
  //     const imageBuffer = await readFile("test/fixtures/images/image.jpg")

  //     try {
  //       await axios.put(`http://localhost:${port}/api/v1/users/me/profile-picture`, imageBuffer)
  //     } catch (error) {
  //       if (error instanceof AxiosError) {
  //         expect(error.response?.status).toBe(401)
  //         expect(error.response?.data).toEqual({
  //           message: "Unauthorized.",
  //         })
  //       } else throw error
  //     }
  //   })
  // })

  // describe("413 Payload Too Large", () => {
  //   it("should return 413 when uploading an image larger than 5MB", async () => {
  //     const imageBuffer = await readFile("test/fixtures/images/image2.jpg")

  //     try {
  //       await axios.put(`http://localhost:${port}/api/v1/users/me/profile-picture`, imageBuffer, {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       })
  //     } catch (error) {
  //       if (error instanceof AxiosError) {
  //         expect(error.response?.status).toBe(413)
  //         expect(error.response?.data).toEqual({
  //           message: "Profile picture exceeds the maximum allowed size of 5MB.",
  //         })
  //       } else throw error
  //     }
  //   })
  // })

  // describe("415 Unsupported Media Type", () => {
  //   it("should return 415 when uploading an unsupported file type", async () => {
  //     const fileBuffer = await readFile("test/fixtures/images/image.gif")

  //     try {
  //       await axios.put(`http://localhost:${port}/api/v1/users/me/profile-picture`, fileBuffer, {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       })
  //     } catch (error) {
  //       if (error instanceof AxiosError) {
  //         expect(error.response?.status).toBe(415)
  //         expect(error.response?.data).toEqual({
  //           message:
  //             "Unsupported file type. Allowed types are: image/jpeg, image/png, image/webp, image/avif, image/heic",
  //         })
  //       } else throw error
  //     }
  //   })
  // })
})
