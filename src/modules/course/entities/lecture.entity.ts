import { Column, Entity, ManyToOne, OneToOne } from "typeorm"
import { BaseEntity } from "../../../base/base.entity"
import { CourseLectureType } from "../enums/course-lecture-type.enum"
import { CourseSection } from "./course-section.entity"
import { LectureArticle } from "./lecture-article.entity"

@Entity({ name: "lectures" })
export class Lecture extends BaseEntity {
  @ManyToOne(() => CourseSection, section => section.id, { onDelete: "CASCADE" })
  public section!: CourseSection

  @Column()
  public title!: string

  @Column()
  public description!: string

  @Column({
    type: "enum",
    enum: CourseLectureType
  })
  public type!: CourseLectureType

  @Column({ name: "display_order" })
  public displayOrder!: number

  @OneToOne(() => LectureArticle, article => article.lecture)
  public article?: LectureArticle
}
