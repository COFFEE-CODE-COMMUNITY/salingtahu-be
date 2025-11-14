import { Column, Entity, OneToOne } from "typeorm"
import { BaseEntity } from "../../../base/base.entity"
import { Lecture } from "./lecture.entity"

@Entity({ name: "lecture_externals" })
export class LectureExternal extends BaseEntity {
  @OneToOne(() => Lecture, lecture => lecture.id, { onDelete: "CASCADE" })
  public lecture!: Lecture

  @Column({ name: "url" })
  public url!: string
}
