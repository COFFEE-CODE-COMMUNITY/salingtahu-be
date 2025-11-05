import { Column, Entity, OneToMany } from "typeorm"
import { BaseEntity } from "../../../base/base.entity"
import { Course } from "./course.entity"

@Entity()
export class CourseSection extends BaseEntity {
  @Column()
  public title!: string

  @Column({ name: "display_order" })
  public displayOrder!: number

  @OneToMany(() => Course, course => course.section)
  public courses!: Course[]
}
