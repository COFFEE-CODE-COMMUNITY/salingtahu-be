import { Column, Entity, OneToOne } from "typeorm"
import { BaseEntity } from "../../../base/base.entity"
import { Lecture } from "./lecture.entity"

@Entity({ name: "lecture_videos" })
export class LectureVideo extends BaseEntity {
  @OneToOne(() => Lecture, lecture => lecture.id, { onDelete: "CASCADE" })
  public lecture!: Lecture

  @Column({ name: "duration_seconds", type: "bigint" })
  public durationMiliSeconds!: number

  @Column({ name: "thumbnail_url" })
  public thumbnailUrl!: string
}
