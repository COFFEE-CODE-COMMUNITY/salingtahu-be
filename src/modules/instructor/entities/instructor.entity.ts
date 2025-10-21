import { Column, Entity, OneToOne } from "typeorm"
import { BaseEntity } from "../../../common/base/base.entity"
import { InstructorStatus } from "../enums/instructor-status.enum"
import { User } from "../../user/entities/user.entity"

@Entity("instructors")
export class Instructor extends BaseEntity {
  @Column({ type: "enum", enum: InstructorStatus, default: InstructorStatus.NOT_VERIFIED })
  public status!: InstructorStatus

  @Column({ nullable: true })
  public verifiedAt?: Date

  @OneToOne(() => User, user => user.instructor, { onDelete: "CASCADE" })
  public user!: User
}
