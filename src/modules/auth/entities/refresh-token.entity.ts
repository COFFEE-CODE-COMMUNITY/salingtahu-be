import { Entity, ManyToOne, Column } from "typeorm"
import { User } from "../../user/entities/user.entity"
import { BaseEntity } from "../../../common/base/base.entity"

@Entity({ name: "refresh_tokens" })
export class RefreshToken extends BaseEntity {
  @Column()
  public token!: string

  @Column({ name: "user_agent" })
  public userAgent!: string

  @Column({ name: "ip_address" })
  public ipAddress!: string

  @Column({ name: "expires_at" })
  public expiresAt!: Date

  @Column({ default: false })
  public revoked!: boolean

  @Column({ name: "revoked_at", nullable: true })
  public revokedAt?: Date

  @ManyToOne(() => User, user => user.refreshTokens, { onDelete: "CASCADE" })
  public user!: User

  public revoke(): void {
    this.revoked = true
    this.revokedAt = new Date()
  }

  public isExpired(): boolean {
    return this.expiresAt < new Date()
  }
}
