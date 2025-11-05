import { ALLOWED_IMAGE_MIMETYPES } from "../../../constants/mimetype.constant"
import { UUID_V4_PATTERN } from "../../../constants/regex.constant"
import { extensions } from "mime-types"
import { IllegalArgumentException } from "../../../exceptions/illegal-argument.exception"

export type AllowedResolution = "128" | "512" | "1024" | "original"

export interface ProfilePicturePathFormat {
  userId: string
  resolution: AllowedResolution
  extension: string
}

export class ProfilePicturePath {
  private readonly ALLOWED_RESOLUTIONS: AllowedResolution[] = ["128", "512", "1024", "original"]
  private readonly ALLOWED_EXTENSIONS = [...ALLOWED_IMAGE_MIMETYPES, "application/octet-stream"].flatMap(
    mime => extensions[mime] || []
  )
  private readonly PATH_REGEX = new RegExp(
    `^users/(${UUID_V4_PATTERN})/profile-picture-(${this.ALLOWED_RESOLUTIONS.join("|")})\\.(${this.ALLOWED_EXTENSIONS.join("|")})$`
  )
  private userId: string
  private resolution: AllowedResolution
  private extension: string

  public constructor(format: ProfilePicturePathFormat)
  public constructor(path: string)
  public constructor(pathOrFormat: string | ProfilePicturePathFormat) {
    if (typeof pathOrFormat === "string") {
      const match = pathOrFormat.match(this.PATH_REGEX)

      if (!match) {
        throw new IllegalArgumentException("Invalid profile picture path format.")
      }

      this.userId = match[1]!
      this.resolution = match[2] as AllowedResolution
      this.extension = match[3]!
    } else {
      this.userId = pathOrFormat.userId
      this.resolution = pathOrFormat.resolution
      this.extension = pathOrFormat.extension
    }
  }

  public getUserId(): string {
    return this.userId
  }

  public getResolution(): AllowedResolution {
    return this.resolution
  }

  public getExtension(): string {
    return this.extension
  }

  public setUserId(userId: string): void {
    const uuidV4Regex = new RegExp(`^${UUID_V4_PATTERN}`)

    if (!uuidV4Regex.test(userId)) {
      throw new IllegalArgumentException("Invalid UUID v4 format for userId.")
    }

    this.userId = userId
  }

  public setResolution(resolution: AllowedResolution): void {
    if (!this.ALLOWED_RESOLUTIONS.includes(resolution)) {
      throw new IllegalArgumentException(`Resolution must be one of: ${this.ALLOWED_RESOLUTIONS.join(", ")}`)
    }

    this.resolution = resolution
  }

  public setExtension(extension: string): void {
    if (!this.ALLOWED_EXTENSIONS.includes(extension)) {
      throw new IllegalArgumentException(`Extension must be one of: ${this.ALLOWED_EXTENSIONS.join(", ")}`)
    }

    this.extension = extension
  }

  public toString(): string {
    return `users/${this.userId}/profile-picture-${this.resolution}.${this.extension}`
  }
}
