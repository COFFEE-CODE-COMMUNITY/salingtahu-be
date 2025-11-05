import { Column, Entity, ManyToMany } from "typeorm"
import { BaseEntity } from "../../../base/base.entity"
import { DecisionWebhook } from "../../../types/veriff"
import { User } from "./user.entity"

@Entity("instructor_verifications")
export class InstructorVerification extends BaseEntity {
  @Column({ name: "verification_data", type: "jsonb" })
  public verificationData!: DecisionWebhook.Payload

  @Column({ name: "verification_id", unique: true })
  public verificationId!: string

  @ManyToMany(() => User, user => user.instructorVerifications)
  public users!: User[]
}
