import { Column, Entity, OneToMany } from "typeorm"
import { BaseEntity } from "../../../base/base.entity"
import { Course } from "./course.entity"
import { AutoMap } from "@automapper/classes"

@Entity({ name: "course_categories" })
export class CourseCategory extends BaseEntity {
  @Column({ unique: true })
  @AutoMap()
  public name!: string

  @OneToMany(() => Course, course => course.category)
  public courses!: Course[]
}
