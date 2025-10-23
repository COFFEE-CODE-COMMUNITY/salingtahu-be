import { ProfilePicturePath } from "./path.helper"
import { IllegalArgumentException } from "../../../exceptions/illegal-argument.exception"

describe("ProfilePicturePath", () => {
  describe("constructor", () => {
    it("should parse a valid profile picture path", () => {
      const path = "users/550e8400-e29b-41d4-a716-446655440000/profile-picture-128.webp"
      const profilePath = new ProfilePicturePath(path)

      expect(profilePath.getUserId()).toBe("550e8400-e29b-41d4-a716-446655440000")
      expect(profilePath.getResolution()).toBe("128")
      expect(profilePath.getExtension()).toBe("webp")
    })

    it("should parse path with 512 resolution", () => {
      const path = "users/550e8400-e29b-41d4-a716-446655440000/profile-picture-512.png"
      const profilePath = new ProfilePicturePath(path)

      expect(profilePath.getResolution()).toBe("512")
      expect(profilePath.getExtension()).toBe("png")
    })

    it("should parse path with 1024 resolution", () => {
      const path = "users/550e8400-e29b-41d4-a716-446655440000/profile-picture-1024.jpeg"
      const profilePath = new ProfilePicturePath(path)

      expect(profilePath.getResolution()).toBe("1024")
      expect(profilePath.getExtension()).toBe("jpeg")
    })

    it("should parse path with original resolution", () => {
      const path = "users/550e8400-e29b-41d4-a716-446655440000/profile-picture-original.avif"
      const profilePath = new ProfilePicturePath(path)

      expect(profilePath.getResolution()).toBe("original")
      expect(profilePath.getExtension()).toBe("avif")
    })

    it("should parse path with heic extension", () => {
      const path = "users/550e8400-e29b-41d4-a716-446655440000/profile-picture-128.heic"
      const profilePath = new ProfilePicturePath(path)

      expect(profilePath.getExtension()).toBe("heic")
    })

    it("should parse path with heif extension", () => {
      const path = "users/550e8400-e29b-41d4-a716-446655440000/profile-picture-128.heif"
      const profilePath = new ProfilePicturePath(path)

      expect(profilePath.getExtension()).toBe("heif")
    })

    it("should throw error for invalid path format", () => {
      const invalidPath = "invalid/path/format"

      expect(() => new ProfilePicturePath(invalidPath)).toThrow(IllegalArgumentException)
      expect(() => new ProfilePicturePath(invalidPath)).toThrow("Invalid profile picture path format.")
    })

    it("should throw error for invalid UUID format", () => {
      const invalidPath = "users/invalid-uuid/profile-picture-128.webp"

      expect(() => new ProfilePicturePath(invalidPath)).toThrow(IllegalArgumentException)
    })

    it("should throw error for invalid resolution", () => {
      const invalidPath = "users/550e8400-e29b-41d4-a716-446655440000/profile-picture-256.webp"

      expect(() => new ProfilePicturePath(invalidPath)).toThrow(IllegalArgumentException)
    })

    it("should throw error for invalid file extension", () => {
      const invalidPath = "users/550e8400-e29b-41d4-a716-446655440000/profile-picture-128.gif"

      expect(() => new ProfilePicturePath(invalidPath)).toThrow(IllegalArgumentException)
    })

    it("should throw error for missing file extension", () => {
      const invalidPath = "users/550e8400-e29b-41d4-a716-446655440000/profile-picture-128"

      expect(() => new ProfilePicturePath(invalidPath)).toThrow(IllegalArgumentException)
    })

    it("should throw error for wrong path structure", () => {
      const invalidPath = "users/550e8400-e29b-41d4-a716-446655440000/avatar-128.webp"

      expect(() => new ProfilePicturePath(invalidPath)).toThrow(IllegalArgumentException)
    })
  })

  describe("setUserId", () => {
    let profilePath: ProfilePicturePath

    beforeEach(() => {
      const path = "users/550e8400-e29b-41d4-a716-446655440000/profile-picture-128.webp"
      profilePath = new ProfilePicturePath(path)
    })

    it("should set a valid UUID v4", () => {
      const newUserId = "123e4567-e89b-12d3-a456-426614174000"
      profilePath.setUserId(newUserId)

      expect(profilePath.getUserId()).toBe(newUserId)
    })

    it("should throw error for invalid UUID format", () => {
      const invalidUserId = "invalid-uuid"

      expect(() => {
        profilePath.setUserId(invalidUserId)
      }).toThrow(IllegalArgumentException)
      expect(() => {
        profilePath.setUserId(invalidUserId)
      }).toThrow("Invalid UUID v4 format for userId.")
    })

    it("should throw error for empty string", () => {
      expect(() => {
        profilePath.setUserId("")
      }).toThrow(IllegalArgumentException)
    })

    it("should throw error for UUID with uppercase letters", () => {
      const invalidUserId = "550E8400-E29B-41D4-A716-446655440000"

      expect(() => {
        profilePath.setUserId(invalidUserId)
      }).toThrow(IllegalArgumentException)
    })
  })

  describe("setResolution", () => {
    let profilePath: ProfilePicturePath

    beforeEach(() => {
      const path = "users/550e8400-e29b-41d4-a716-446655440000/profile-picture-128.webp"
      profilePath = new ProfilePicturePath(path)
    })

    it("should set resolution to 128", () => {
      profilePath.setResolution("128")

      expect(profilePath.getResolution()).toBe("128")
    })

    it("should set resolution to 512", () => {
      profilePath.setResolution("512")

      expect(profilePath.getResolution()).toBe("512")
    })

    it("should set resolution to 1024", () => {
      profilePath.setResolution("1024")

      expect(profilePath.getResolution()).toBe("1024")
    })

    it("should set resolution to original", () => {
      profilePath.setResolution("original")

      expect(profilePath.getResolution()).toBe("original")
    })

    it("should throw error for invalid resolution", () => {
      expect(() => {
        // @ts-expect-error Testing invalid input
        profilePath.setResolution("256")
      }).toThrow(IllegalArgumentException)
      expect(() => {
        // @ts-expect-error Testing invalid input
        profilePath.setResolution("256")
      }).toThrow("Resolution must be one of: 128, 512, 1024, original")
    })

    it("should throw error for empty string resolution", () => {
      expect(() => {
        // @ts-expect-error Testing invalid input
        profilePath.setResolution("")
      }).toThrow(IllegalArgumentException)
    })
  })

  describe("setExtension", () => {
    let profilePath: ProfilePicturePath

    beforeEach(() => {
      const path = "users/550e8400-e29b-41d4-a716-446655440000/profile-picture-128.webp"
      profilePath = new ProfilePicturePath(path)
    })

    it("should set extension to webp", () => {
      profilePath.setExtension("webp")

      expect(profilePath.getExtension()).toBe("webp")
    })

    it("should set extension to avif", () => {
      profilePath.setExtension("avif")

      expect(profilePath.getExtension()).toBe("avif")
    })

    it("should set extension to jpeg", () => {
      profilePath.setExtension("jpeg")

      expect(profilePath.getExtension()).toBe("jpeg")
    })

    it("should set extension to jpg (alias for jpeg)", () => {
      profilePath.setExtension("jpg")

      expect(profilePath.getExtension()).toBe("jpg")
    })

    it("should set extension to png", () => {
      profilePath.setExtension("png")

      expect(profilePath.getExtension()).toBe("png")
    })

    it("should set extension to heic", () => {
      profilePath.setExtension("heic")

      expect(profilePath.getExtension()).toBe("heic")
    })

    it("should set extension to heif", () => {
      profilePath.setExtension("heif")

      expect(profilePath.getExtension()).toBe("heif")
    })

    it("should throw error for invalid extension", () => {
      expect(() => {
        profilePath.setExtension("gif")
      }).toThrow(IllegalArgumentException)
      expect(() => {
        profilePath.setExtension("gif")
      }).toThrow(/Extension must be one of:/)
    })

    it("should throw error for empty string extension", () => {
      expect(() => {
        profilePath.setExtension("")
      }).toThrow(IllegalArgumentException)
    })

    it("should throw error for unsupported extension", () => {
      expect(() => {
        profilePath.setExtension("bmp")
      }).toThrow(IllegalArgumentException)
    })
  })

  describe("toString", () => {
    it("should return the formatted path string", () => {
      const path = "users/550e8400-e29b-41d4-a716-446655440000/profile-picture-128.webp"
      const profilePath = new ProfilePicturePath(path)

      expect(profilePath.toString()).toBe(path)
    })

    it("should return updated path after changing userId", () => {
      const path = "users/550e8400-e29b-41d4-a716-446655440000/profile-picture-128.webp"
      const profilePath = new ProfilePicturePath(path)
      const newUserId = "123e4567-e89b-12d3-a456-426614174000"

      profilePath.setUserId(newUserId)

      expect(profilePath.toString()).toBe("users/123e4567-e89b-12d3-a456-426614174000/profile-picture-128.webp")
    })

    it("should return updated path after changing resolution", () => {
      const path = "users/550e8400-e29b-41d4-a716-446655440000/profile-picture-128.webp"
      const profilePath = new ProfilePicturePath(path)

      profilePath.setResolution("512")

      expect(profilePath.toString()).toBe("users/550e8400-e29b-41d4-a716-446655440000/profile-picture-512.webp")
    })

    it("should return updated path after changing extension", () => {
      const path = "users/550e8400-e29b-41d4-a716-446655440000/profile-picture-128.webp"
      const profilePath = new ProfilePicturePath(path)

      profilePath.setExtension("png")

      expect(profilePath.toString()).toBe("users/550e8400-e29b-41d4-a716-446655440000/profile-picture-128.png")
    })

    it("should return updated path after changing all properties", () => {
      const path = "users/550e8400-e29b-41d4-a716-446655440000/profile-picture-128.webp"
      const profilePath = new ProfilePicturePath(path)

      profilePath.setUserId("123e4567-e89b-12d3-a456-426614174000")
      profilePath.setResolution("original")
      profilePath.setExtension("avif")

      expect(profilePath.toString()).toBe("users/123e4567-e89b-12d3-a456-426614174000/profile-picture-original.avif")
    })
  })
})
