import { Column, Entity, JoinColumn, OneToOne } from "typeorm"
import { BaseEntity } from "../../../base/base.entity"
import { Lecture } from "./lecture.entity"
import { LectureVideoStatus } from "../enums/lecture-video-status.enum"

@Entity({ name: "lecture_videos" })
export class LectureVideo extends BaseEntity {
  @OneToOne(() => Lecture, lecture => lecture.video, { onDelete: "CASCADE" })
  @JoinColumn({ name: "lecture_id" })
  public lecture!: Lecture

  @Column({ name: "duration_milliseconds", type: "bigint", nullable: true })
  public durationMilliseconds?: number

  @Column({ type: "bigint", nullable: true })
  public size?: number

  @Column({ nullable: true })
  public path?: string

  @Column({ nullable: true })
  public mimetype?: string

  @Column({ nullable: true, type: "int", array: true })
  public resolutions?: number[]

  @Column({
    name: "status",
    type: "enum",
    enum: LectureVideoStatus,
    default: LectureVideoStatus.EMPTY
  })
  public status!: LectureVideoStatus
}
