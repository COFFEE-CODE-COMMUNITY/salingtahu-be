import { Column, Entity, ManyToOne } from "typeorm"
import { BaseEntity } from "../../../base/base.entity"
import { User } from "../../user/entities/user.entity"
import { Course } from "./course.entity"

@Entity({ name: "course_reviews" })
export class CourseReview extends BaseEntity {
  @ManyToOne(() => User, user => user.id, { onDelete: "CASCADE" })
  public user!: User

  @ManyToOne(() => Course, course => course.reviews, { onDelete: "CASCADE" })
  public course!: Course

  @Column("smallint")
  public rating!: number

  @Column()
  public review!: string
}
