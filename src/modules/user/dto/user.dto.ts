import { ApiProperty } from "@nestjs/swagger"
import { Language } from "../../../common/enums/language"
import { UserStatus } from "../enums/user-status.enum"
import { UserRole } from "../enums/user-role.enum"
import { ImageDto } from "../../../common/dto/image.dto"
import { AutoMap } from "@automapper/classes"

export class UserDto {
  @ApiProperty({
    description: "Unique identifier of the user",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @AutoMap()
  public id!: string

  @ApiProperty({
    description: "First name of the user",
    example: "John",
  })
  @AutoMap()
  public firstName!: string

  @ApiProperty({
    description: "Last name of the user",
    example: "Doe",
  })
  @AutoMap()
  public lastName!: string

  @ApiProperty({
    description: "Email address of the user",
    example: "john.doe@example.com",
  })
  @AutoMap()
  public email!: string

  @ApiProperty({
    description: "Professional headline or tagline",
    example: "Full Stack Developer | Tech Enthusiast",
  })
  @AutoMap()
  public headline!: string

  @ApiProperty({
    description: "User biography or about section",
    example: "Passionate developer with 5+ years of experience in web development",
  })
  @AutoMap()
  public biography!: string

  @ApiProperty({
    enum: Language,
    description: "Preferred language for the user",
    example: Language.ENGLISH_US,
  })
  @AutoMap()
  public language!: Language

  @ApiProperty({
    description: "Array of user profile pictures with dimensions",
    example: [
      {
        url: "https://example.com/profile/avatar.jpg",
        width: 400,
        height: 400,
      },
    ],
    type: [ImageDto],
    isArray: true,
  })
  public profilePictures!: ImageDto[]

  @ApiProperty({
    description: "Personal or professional website URL",
    example: "https://johndoe.com",
  })
  @AutoMap()
  public websiteUrl!: string

  @ApiProperty({
    description: "Facebook profile URL",
    example: "https://facebook.com/johndoe",
  })
  @AutoMap()
  public facebookUrl!: string

  @ApiProperty({
    description: "Instagram profile URL",
    example: "https://instagram.com/johndoe",
  })
  @AutoMap()
  public instagramUrl!: string

  @ApiProperty({
    description: "LinkedIn profile URL",
    example: "https://linkedin.com/in/johndoe",
  })
  @AutoMap()
  public linkedinUrl!: string

  @ApiProperty({
    description: "TikTok profile URL",
    example: "https://tiktok.com/@johndoe",
  })
  @AutoMap()
  public tiktokUrl!: string

  @ApiProperty({
    description: "X (formerly Twitter) profile URL",
    example: "https://x.com/johndoe",
  })
  @AutoMap()
  public xUrl!: string

  @ApiProperty({
    description: "YouTube channel URL",
    example: "https://youtube.com/@johndoe",
  })
  @AutoMap()
  public youtubeUrl!: string

  @ApiProperty({
    enum: UserStatus,
    description: "Current status of the user account",
    example: UserStatus.ACTIVE,
  })
  @AutoMap()
  public status!: UserStatus

  @ApiProperty({
    enum: UserRole,
    isArray: true,
    description: "Roles assigned to the user",
    example: [UserRole.STUDENT, UserRole.ADMIN],
  })
  @AutoMap()
  public roles!: UserRole[]

  @ApiProperty({
    description: "Timestamp of the last login",
    example: "2024-01-15T10:30:00Z",
  })
  @AutoMap()
  public lastLoginAt!: Date

  @ApiProperty({
    description: "Timestamp when the user account was created",
    example: "2023-06-01T08:00:00Z",
  })
  @AutoMap()
  public createdAt!: Date
}
