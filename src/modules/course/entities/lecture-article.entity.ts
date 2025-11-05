import { Column, Entity, OneToOne } from "typeorm"
import { BaseEntity } from "../../../base/base.entity"
import { Lecture } from "./lecture.entity"

@Entity()
export class LectureArticle extends BaseEntity {
  @OneToOne(() => Lecture, (lecture) => lecture.id, {onDelete: "CASCADE"})
  public lecture!: Lecture

  @Column()
  public content!: string
}
