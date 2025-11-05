import { Column, Entity, ManyToOne } from "typeorm"
import { BaseEntity } from "../../../base/base.entity"
import { User } from "../../user/entities/user.entity"
import { CourseLectureType } from "../enums/course-lecture-type.enum"
import { CourseSection } from "./course-section.entity"

@Entity()
export class Lecture extends BaseEntity {
  @ManyToOne(() => User, user => user.id, {onDelete: "CASCADE"})
  public user!: User

  @ManyToOne(() => CourseSection, section => section.id, {onDelete: "CASCADE"})
  public section!: CourseSection

  @Column()
  public title!: string

  @Column()
  public description!: string

  @Column({
    type: 'enum',
    enum: CourseLectureType,
  })
  public type!: CourseLectureType

  @Column({ name:"display_order" })
  public displayOrder!: number

}
