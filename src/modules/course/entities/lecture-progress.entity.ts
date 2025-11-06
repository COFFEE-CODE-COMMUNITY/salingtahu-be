import { Column, Entity, OneToMany } from "typeorm"
import { BaseEntity } from "../../../base/base.entity"
import { Lecture } from "./lecture.entity"
import { User } from "../../user/entities/user.entity"

@Entity({ name: "lecture_progresses" })
export class LectureProgress extends BaseEntity {
  @OneToMany(() => Lecture, lecture => lecture.id, { onDelete: "CASCADE" })
  public lecture!: Lecture

  @OneToMany(() => User, user => user.id, { onDelete: "CASCADE" })
  public user!: User

  @Column()
  public complete!: boolean
}
