import { AutoMap } from "@automapper/classes"
import { Column, Entity, Index, ManyToOne } from "typeorm"
import { BaseEntity } from "../../../base/base.entity"
import { User } from "../../user/entities/user.entity"
import { Course } from "../../course/entities/course.entity"
import { PaymentStatus } from "../enums/payment-status.enum"

@Entity({ name: "transactions" })
@Index(["user"])
@Index(["course"])
@Index(["transactionId"])
@Index(["status"])
export class Transaction extends BaseEntity {
  @Column({ type: "decimal", precision: 10, scale: 2, name: "amount" })
  @AutoMap()
  public amount!: number

  @Column({ type: "varchar", default: "IDR" })
  @AutoMap()
  public currency!: string

  @Column({ type: "varchar", name: "payment_gateway", default: "midtrans" })
  @AutoMap()
  public paymentGateway!: string

  @Column({ type: "varchar", name: "transaction_id", unique: true, nullable: true })
  @AutoMap()
  public transactionId?: string

  @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
  @AutoMap()
  public status!: PaymentStatus

  @Column({ type: "jsonb", name: "payment_details", nullable: true })
  @AutoMap()
  public paymentDetails?: Record<string, any>

  @ManyToOne(() => User, { nullable: false })
  @AutoMap(() => User)
  public user!: User

  @ManyToOne(() => Course, { nullable: false })
  @AutoMap(() => Course)
  public course!: Course
}
