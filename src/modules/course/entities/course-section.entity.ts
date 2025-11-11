import { Column, Entity, ManyToOne } from "typeorm"
import { BaseEntity } from "../../../base/base.entity"
import { Course } from "./course.entity"

@Entity({ name: "course_sections" })
export class CourseSection extends BaseEntity {
  @Column()
  public title!: string

  @Column({ name: "display_order" })
  public displayOrder!: number

  @ManyToOne(() => Course, course => course.sections)
  public course!: Course
}
