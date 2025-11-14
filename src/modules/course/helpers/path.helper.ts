import { ALLOWED_IMAGE_MIMETYPES, ALLOWED_VIDEO_MIMETYPES } from "../../../constants/mimetype.constant"
import { UUID_V4_PATTERN } from "../../../constants/regex.constant"
import { extensions } from "mime-types"
import { IllegalArgumentException } from "../../../exceptions/illegal-argument.exception"

export type AllowedResolution = "128" | "512" | "1024" | "original"
export type AllowedVideoResolution = "240" | "360" | "480" | "720" | "1080" | "1440" | "2160" | "4320" | "original"

export interface VideoThumbnailPathFormat {
  videoId: string
  resolution: AllowedResolution
  extension: string
}

export interface LectureVideoPathFormat {
  lectureId: string
  resolution: AllowedVideoResolution
  extension: string
}

export class VideoThumbnailPath {
  private readonly ALLOWED_RESOLUTIONS: AllowedResolution[] = ["128", "512", "1024", "original"]
  private readonly ALLOWED_EXTENSIONS = [...ALLOWED_IMAGE_MIMETYPES, "application/octet-stream"].flatMap(
    mime => extensions[mime] || []
  )
  private readonly PATH_REGEX = new RegExp(
    `^courses/(${UUID_V4_PATTERN})/video-thumbnail-(${this.ALLOWED_RESOLUTIONS.join("|")})\\.(${this.ALLOWED_EXTENSIONS.join("|")})$`
  )
  private videoId: string
  private resolution: AllowedResolution
  private extension: string

  public constructor(format: VideoThumbnailPathFormat)
  public constructor(path: string)
  public constructor(pathOrFormat: string | VideoThumbnailPathFormat) {
    if (typeof pathOrFormat === "string") {
      const match = pathOrFormat.match(this.PATH_REGEX)

      if (!match) {
        throw new IllegalArgumentException("Invalid video thumbnail path format.")
      }

      this.videoId = match[1]!
      this.resolution = match[2] as AllowedResolution
      this.extension = match[3]!
    } else {
      this.videoId = pathOrFormat.videoId
      this.resolution = pathOrFormat.resolution
      this.extension = pathOrFormat.extension
    }
  }

  public getVideoId(): string {
    return this.videoId
  }

  public getResolution(): AllowedResolution {
    return this.resolution
  }

  public getExtension(): string {
    return this.extension
  }

  public setVideoId(videoId: string): void {
    const uuidV4Regex = new RegExp(`^${UUID_V4_PATTERN}`)

    if (!uuidV4Regex.test(videoId)) {
      throw new IllegalArgumentException("Invalid UUID v4 format for videoId.")
    }

    this.videoId = videoId
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
    return `courses/${this.videoId}/video-thumbnail-${this.resolution}.${this.extension}`
  }
}

export class LectureVideoTemporaryPath {
  private readonly PATH_REGEX = new RegExp(`^courses/(${UUID_V4_PATTERN})/(${UUID_V4_PATTERN})\\.bin$`)

  private readonly courseId: string
  private readonly lectureId: string

  public constructor(courseId: string, lectureId: string)
  public constructor(path: string)
  public constructor(courseIdOrPath: string, lectureId?: string) {
    if (lectureId === undefined) {
      const match = courseIdOrPath.match(this.PATH_REGEX)

      if (!match) {
        throw new IllegalArgumentException("Invalid lecture video temporary path format.")
      }

      this.courseId = match[1]!
      this.lectureId = match[2]!
    } else {
      this.validateUuid(courseIdOrPath, "courseId")
      this.validateUuid(lectureId, "lectureId")
      this.courseId = courseIdOrPath
      this.lectureId = lectureId
    }
  }

  private validateUuid(value: string, fieldName: string): void {
    const uuidV4Regex = new RegExp(`^${UUID_V4_PATTERN}$`)

    if (!uuidV4Regex.test(value)) {
      throw new IllegalArgumentException(`Invalid UUID v4 format for ${fieldName}.`)
    }
  }

  public getCourseId(): string {
    return this.courseId
  }

  public getLectureId(): string {
    return this.lectureId
  }

  public toString(): string {
    return `courses/${this.courseId}/${this.lectureId}.bin`
  }
}

export class LectureVideoPath {
  private readonly ALLOWED_RESOLUTIONS: AllowedVideoResolution[] = [
    "240",
    "360",
    "480",
    "720",
    "1080",
    "1440",
    "2160",
    "4320",
    "original"
  ]
  private readonly ALLOWED_EXTENSIONS = [...ALLOWED_VIDEO_MIMETYPES, "application/octet-stream"].flatMap(
    mime => extensions[mime] || []
  )
  private readonly PATH_REGEX = new RegExp(
    `^courses/(${UUID_V4_PATTERN})/lecture-video-(${this.ALLOWED_RESOLUTIONS.join("|")})\\.(${this.ALLOWED_EXTENSIONS.join("|")})$`
  )
  private lectureId: string
  private resolution: AllowedVideoResolution
  private extension: string

  public constructor(format: LectureVideoPathFormat)
  public constructor(path: string)
  public constructor(pathOrFormat: string | LectureVideoPathFormat) {
    if (typeof pathOrFormat === "string") {
      const match = pathOrFormat.match(this.PATH_REGEX)

      if (!match) {
        throw new IllegalArgumentException("Invalid lecture video path format.")
      }

      this.lectureId = match[1]!
      this.resolution = match[2] as AllowedVideoResolution
      this.extension = match[3]!
    } else {
      this.lectureId = pathOrFormat.lectureId
      this.resolution = pathOrFormat.resolution
      this.extension = pathOrFormat.extension
    }
  }

  public getLectureId(): string {
    return this.lectureId
  }

  public getResolution(): AllowedVideoResolution {
    return this.resolution
  }

  public getExtension(): string {
    return this.extension
  }

  public setLectureId(lectureId: string): void {
    const uuidV4Regex = new RegExp(`^${UUID_V4_PATTERN}`)

    if (!uuidV4Regex.test(lectureId)) {
      throw new IllegalArgumentException("Invalid UUID v4 format for lectureId.")
    }

    this.lectureId = lectureId
  }

  public setResolution(resolution: AllowedVideoResolution): void {
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
    return `courses/${this.lectureId}/lecture-video-${this.resolution}.${this.extension}`
  }
}
