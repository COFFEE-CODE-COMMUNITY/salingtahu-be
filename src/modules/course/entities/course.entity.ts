import { Column, Entity, ManyToOne, OneToMany, VirtualColumn } from "typeorm"
import { BaseEntity } from "../../../base/base.entity"
import { Language } from "../../../enums/language"
import { CourseStatus } from "../enums/course-status.enum"
import { CourseSection } from "./course-section.entity"
import { AutoMap } from "@automapper/classes"
import { CourseCategory } from "./course-category.entity"
import { CourseReview } from "./course-review.entity"
import { ImageMetadata } from "../../../entities/image-metadata.entity"
import { User } from "../../user/entities/user.entity"

@Entity({ name: "courses" })
export class Course extends BaseEntity {
  @Column()
  @AutoMap()
  public title!: string

  @Column({ unique: true })
  @AutoMap()
  public slug!: string

  @Column({ type: "text", nullable: true })
  @AutoMap()
  public description?: string

  @Column({ type: "enum", enum: Language, default: Language.ENGLISH_US })
  @AutoMap()
  public language!: Language

  @Column()
  @AutoMap()
  public price!: number

  @Column({ type: "enum", enum: CourseStatus, default: CourseStatus.DRAFT })
  @AutoMap()
  public status!: CourseStatus

  @Column({ name: "thumbnail", type: "jsonb", nullable: true })
  @AutoMap(() => ImageMetadata)
  public thumbnail?: ImageMetadata

  @VirtualColumn({
    query: alias => `SELECT AVG(cr.rating) FROM course_reviews cr WHERE cr.courseId = ${alias}.id`
  })
  public averageRating!: number

  @VirtualColumn({
    query: alias => `SELECT COUNT(cr.id) FROM course_reviews cr WHERE cr.courseId = ${alias}.id`
  })
  public totalReviews!: number

  @OneToMany(() => CourseSection, section => section.courses)
  public section!: CourseSection[]

  @OneToMany(() => CourseCategory, category => category.courses)
  public category!: CourseCategory[]

  @OneToMany(() => CourseReview, courseReview => courseReview.course)
  public reviews!: CourseReview[]

  @ManyToOne(() => User, user => user.courses)
  public instructor!: User
}
