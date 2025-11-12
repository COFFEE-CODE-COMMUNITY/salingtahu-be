import { Column, Entity, OneToOne } from "typeorm"
import { BaseEntity } from "../../../base/base.entity"
import { Lecture } from "./lecture.entity"

export enum VideoStatus {
  UPLOADING = "uploading",
  PROCESSING = "processing",
  READY = "ready",
  FAILED = "failed"
}

@Entity({ name: "lecture_videos" })
export class LectureVideo extends BaseEntity {
  @OneToOne(() => Lecture, lecture => lecture.id, { onDelete: "CASCADE" })
  public lecture!: Lecture

  @Column({ name: "duration_seconds", type: "bigint", nullable: true })
  public durationMiliSeconds?: number

  @Column({ name: "thumbnail_url", nullable: true })
  public thumbnailUrl?: string

  @Column({ name: "video_url", nullable: true })
  public videoUrl?: string

  @Column({ name: "file_size", type: "bigint", nullable: true })
  public fileSize?: number

  @Column({ name: "file_name", nullable: true })
  public fileName?: string

  @Column({ name: "mime_type", nullable: true })
  public mimeType?: string

  @Column({ name: "resolution", nullable: true })
  public resolution?: string

  @Column({
    name: "status",
    type: "enum",
    enum: VideoStatus,
    default: VideoStatus.UPLOADING
  })
  public status!: VideoStatus

  @Column({ name: "total_chunks", type: "int", nullable: true })
  public totalChunks?: number

  @Column({ name: "uploaded_chunks", type: "jsonb", default: [] })
  public uploadedChunks!: number[]

  @Column({ name: "error_message", type: "text", nullable: true })
  public errorMessage?: string
}
