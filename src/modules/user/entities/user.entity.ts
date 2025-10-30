import { Column, Entity, ManyToMany, OneToMany } from "typeorm"
import { BaseEntity } from "../../../common/base/base.entity"
import { Language } from "../../../common/enums/language"
import { AutoMap } from "@automapper/classes"
import { UserStatus } from "../enums/user-status.enum"
import { UserRole } from "../enums/user-role.enum"
import { RefreshToken } from "../../auth/entities/refresh-token.entity"
import { OAuth2User } from "../../auth/entities/oauth2-user.entity"
import { ImageMetadata } from "../../../entities/image-metadata.entity"
import { PasswordResetSession } from "../../auth/entities/password-reset-session.entity"
import { InstructorVerification } from "./instructor-verification.entity"

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
  @AutoMap()
  public headline?: string

  @Column({ nullable: true })
  @AutoMap()
  public biography?: string

  @Column({ type: "enum", enum: Language, default: Language.ENGLISH_US })
  @AutoMap()
  public language!: Language

  @Column({ name: "profile_pictures", type: "jsonb", nullable: true })
  @AutoMap()
  public profilePictures?: ImageMetadata[]

  @Column({ name: "website_url", nullable: true })
  @AutoMap()
  public websiteUrl?: string

  @Column({ name: "facebook_url", nullable: true })
  @AutoMap()
  public facebookUrl?: string

  @Column({ name: "instagram_url", nullable: true })
  @AutoMap()
  public instagramUrl?: string

  @Column({ name: "linkedin_url", nullable: true })
  @AutoMap()
  public linkedinUrl?: string

  @Column({ name: "tiktok_url", nullable: true })
  @AutoMap()
  public tiktokUrl?: string

  @Column({ name: "x_url", nullable: true })
  @AutoMap()
  public xUrl?: string

  @Column({ name: "youtube_url", nullable: true })
  @AutoMap()
  public youtubeUrl?: string

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.ACTIVE })
  public status!: UserStatus

  @Column({ name: "last_logged_in_at", nullable: true })
  public lastLoggedInAt?: Date

  @Column({ type: "enum", enum: UserRole, array: true, default: [UserRole.STUDENT] })
  public roles!: UserRole[]

  @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
  public refreshTokens!: RefreshToken[]

  @OneToMany(() => OAuth2User, oauth2User => oauth2User.user, { cascade: true })
  public oauth2Users!: OAuth2User[]

  @OneToMany(() => PasswordResetSession, passwordResetSession => passwordResetSession.user)
  public passwordResetSessions!: PasswordResetSession[]

  @ManyToMany(() => InstructorVerification, instructorVerifications => instructorVerifications.users)
  public instructorVerifications!: InstructorVerification[]

  public updateLastLoggedIn(): void {
    this.lastLoggedInAt = new Date()
  }
}
