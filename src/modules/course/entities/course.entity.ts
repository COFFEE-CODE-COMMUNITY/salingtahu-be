import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../base/base.entity";
import { Language } from "../../../enums/language";
import { CourseStatus } from "../enums/course-status.enum";
import { CourseSection } from "./course-section.entity";

@Entity()
export class Course extends BaseEntity {
  @Column()
  public title!: string

  @Column({ unique: true })
  public slug!: string

  @Column({ type: "text", nullable: true })
  public description?: string

  @Column({ type: "enum", enum: Language, default: Language.ENGLISH_US })
  public language!: Language

  @Column()
  public price!: number

  @Column({ type: "enum", enum: CourseStatus, default: CourseStatus.DRAFT })
  public status!: CourseStatus

  @Column({ name: "thumbnail_path" })
  public thumbnailPath!: string

  @ManyToOne(() => CourseSection, section => section.courses)
  public section!: CourseSection
}
