import { Column, Entity, ManyToOne, Unique } from "typeorm"
import { BaseEntity } from "../../../base/base.entity"
import { OAuth2Provider } from "../enums/oauth2-provider.enum"
import { User } from "../../user/entities/user.entity"

@Entity({ name: "oauth2_users" })
@Unique(["provider", "providerUserId"])
export class OAuth2User extends BaseEntity {
  @Column({ enum: OAuth2Provider, type: "enum" })
  public provider!: OAuth2Provider

  @Column({ name: "provider_user_id" })
  public providerUserId!: string

  @ManyToOne(() => User, user => user.id, { onDelete: "CASCADE" })
  public user!: User
}
