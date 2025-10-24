import { BaseEntity } from "../../../common/base/base.entity"
import { Column, Entity, ManyToOne } from "typeorm"
import { User } from "../../user/entities/user.entity"

@Entity({ name: "password_reset_sessions" })
export class PasswordResetSession extends BaseEntity {
  @Column()
  public token!: string

  @Column({ name: "expires_at" })
  public expiresAt!: Date

  @Column({ default: false })
  public used!: boolean

  @Column({ name: "used_at", nullable: true })
  public usedAt?: Date

  @ManyToOne(() => User, user => user.passwordResetSessions, { onDelete: "CASCADE" })
  public user!: User

  public isExpired(): boolean {
    return new Date() > this.expiresAt
  }
}
