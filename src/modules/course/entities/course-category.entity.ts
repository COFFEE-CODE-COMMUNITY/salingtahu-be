import { Column, Entity } from "typeorm"
import { BaseEntity } from "../../../base/base.entity"

@Entity()
export class CourseCategory extends BaseEntity {
  @Column()
  public name!: string
}
