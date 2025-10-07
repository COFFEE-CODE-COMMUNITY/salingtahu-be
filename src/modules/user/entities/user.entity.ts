import { Column, Entity } from "typeorm"
import { BaseEntity } from "../../../common/base/base.entity"
import { Language } from "../../../common/enums/language"
import { AutoMap } from "@automapper/classes"
import { UserStatus } from "../enums/user-status.enum"
import { UserRole } from "../enums/user-role.enum"

@Entity({ name: "users" })
export class User extends BaseEntity {
  @Column({ name: "first_name" })
  @AutoMap()
  public firstName!: string

  @Column({ name: "last_name" })
  @AutoMap()
  public lastName!: string

  @Column({ unique: true })
  @AutoMap()
  public email!: string

  @Column({ nullable: true })
  @AutoMap()
  public password?: string

  @Column({ nullable: true })
  public headline?: string

  @Column({ nullable: true })
  public biography?: string

  @Column({ type: "enum", enum: Language, default: Language.ENGLISH_US })
  public language!: Language

  @Column({ name: "profile_picture_path", nullable: true })
  public profilePicturePath?: string

  @Column({ name: "website_url", nullable: true })
  public websiteUrl?: string

  @Column({ name: "facebook_url", nullable: true })
  public facebookUrl?: string

  @Column({ name: "instagram_url", nullable: true })
  public instagramUrl?: string

  @Column({ name: "linkedin_url", nullable: true })
  public linkedinUrl?: string

  @Column({ name: "tiktok_url", nullable: true })
  public tiktokUrl?: string

  @Column({ name: "x_url", nullable: true })
  public xUrl?: string

  @Column({ name: "youtube_url", nullable: true })
  public youtubeUrl?: string

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.ACTIVE })
  public status!: UserStatus

  @Column({ type: "enum", enum: UserRole, array: true, default: [UserRole.STUDENT] })
  public roles!: UserRole[]
}
