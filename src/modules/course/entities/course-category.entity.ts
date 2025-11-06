import { Column, Entity, OneToMany } from "typeorm"
import { BaseEntity } from "../../../base/base.entity"
import { Course } from "./course.entity"

@Entity({ name: "course_categories" })
export class CourseCategory extends BaseEntity {
  @Column({ unique: true })
  public name!: string

  @OneToMany(() => Course, course => course.category)
  public courses!: Course[]
}
