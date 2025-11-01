import { ApiProperty } from "@nestjs/swagger"
import { Language } from "../../../enums/language"
import { UserStatus } from "../enums/user-status.enum"
import { UserRole } from "../enums/user-role.enum"
import { ImageDto } from "../../../dto/image.dto"
import { AutoMap } from "@automapper/classes"
import { ReadOnly } from "../../../mappers/readonly.decorator"
import { IsEnum, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator"

export class UserDto {
  @ApiProperty({
    description: "Unique identifier of the user",
    example: "123e4567-e89b-12d3-a456-426614174000",
    readOnly: true
  })
  @ReadOnly()
  @AutoMap()
  public id!: string

  @ApiProperty({
    description: "First name of the user",
    example: "John"
  })
  @MaxLength(30, { message: "First name must be at most 30 characters long." })
  @MinLength(1, { message: "First name must be at least 1 character long." })
  @IsString({ message: "First name must be a string." })
  @IsOptional()
  @AutoMap()
  public firstName!: string

  @ApiProperty({
    description: "Last name of the user",
    example: "Doe"
  })
  @MaxLength(30, { message: "Last name must be at most 30 characters long." })
  @MinLength(1, { message: "Last name must be at least 1 character long." })
  @IsString({ message: "Last name must be a string." })
  @IsOptional()
  @AutoMap()
  public lastName!: string

  @ApiProperty({
    description: "Email address of the user",
    example: "john.doe@example.com",
    readOnly: true
  })
  @ReadOnly()
  @AutoMap()
  public email!: string

  @ApiProperty({
    description: "Professional headline or tagline",
    example: "Full Stack Developer | Tech Enthusiast"
  })
  @MaxLength(100, { message: "Headline must be at most 100 characters long." })
  @IsString({ message: "Headline must be a string." })
  @IsOptional()
  @AutoMap()
  public headline!: string

  @ApiProperty({
    description: "User biography or about section",
    example: "Passionate developer with 5+ years of experience in web development"
  })
  @MaxLength(5000, { message: "Biography must be at most 500 characters long." })
  @IsString({ message: "Biography must be a string." })
  @IsOptional()
  @AutoMap()
  public biography!: string

  @ApiProperty({
    enum: Language,
    description: "Preferred language for the user",
    example: Language.ENGLISH_US
  })
  @IsEnum(Language, { message: "Language must be a valid enum value." })
  @IsOptional()
  @AutoMap()
  public language!: Language

  @ApiProperty({
    description: "Array of user profile pictures with dimensions",
    example: [
      {
        url: "https://example.com/profile/avatar.jpg",
        width: 400,
        height: 400
      }
    ],
    type: [ImageDto],
    isArray: true
  })
  @ReadOnly()
  @AutoMap(() => [ImageDto])
  public profilePictures!: ImageDto[]

  @ApiProperty({
    description: "Personal or professional website URL",
    example: "https://johndoe.com"
  })
  @IsUrl(
    {
      protocols: ["http", "https"]
    },
    { message: "Website URL must be a valid URL." }
  )
  @MaxLength(200, { message: "Website URL must be at most 200 characters long." })
  @IsString({ message: "Website URL must be a string." })
  @IsOptional()
  @AutoMap()
  public websiteUrl!: string

  @ApiProperty({
    description: "Facebook profile URL",
    example: "https://facebook.com/johndoe"
  })
  @IsUrl(
    {
      protocols: ["http", "https"],
      host_whitelist: ["www.facebook.com", "facebook.com", "m.facebook.com"]
    },
    { message: "Facebook URL must be a valid URL." }
  )
  @MaxLength(200, { message: "Facebook URL must be at most 200 characters long." })
  @IsString({ message: "Facebook URL must be a string." })
  @IsOptional()
  @AutoMap()
  public facebookUrl!: string

  @ApiProperty({
    description: "Instagram profile URL",
    example: "https://instagram.com/johndoe"
  })
  @IsUrl(
    {
      protocols: ["http", "https"],
      host_whitelist: ["www.instagram.com", "instagram.com"]
    },
    { message: "Instagram URL must be a valid URL." }
  )
  @MaxLength(200, { message: "Instagram URL must be at most 200 characters long." })
  @IsString({ message: "Instagram URL must be a string." })
  @IsOptional()
  @AutoMap()
  public instagramUrl!: string

  @ApiProperty({
    description: "LinkedIn profile URL",
    example: "https://linkedin.com/in/johndoe"
  })
  @IsUrl(
    {
      protocols: ["http", "https"],
      host_whitelist: ["www.linkedin.com", "linkedin.com"]
    },
    { message: "LinkedIn URL must be a valid URL." }
  )
  @MaxLength(200, { message: "LinkedIn URL must be at most 200 characters long." })
  @IsString({ message: "LinkedIn URL must be a string." })
  @IsOptional()
  @AutoMap()
  public linkedinUrl!: string

  @ApiProperty({
    description: "TikTok profile URL",
    example: "https://tiktok.com/@johndoe"
  })
  @IsUrl(
    {
      protocols: ["http", "https"],
      host_whitelist: ["www.tiktok.com", "tiktok.com"]
    },
    { message: "TikTok URL must be a valid URL." }
  )
  @MaxLength(200, { message: "TikTok URL must be at most 200 characters long." })
  @IsString({ message: "TikTok URL must be a string." })
  @IsOptional()
  @AutoMap()
  public tiktokUrl!: string

  @ApiProperty({
    description: "X (formerly Twitter) profile URL",
    example: "https://x.com/johndoe"
  })
  @IsUrl(
    {
      protocols: ["http", "https"],
      host_whitelist: ["www.x.com", "x.com", "www.twitter.com", "twitter.com"]
    },
    { message: "X URL must be a valid URL." }
  )
  @MaxLength(200, { message: "X URL must be at most 200 characters long." })
  @IsString({ message: "X URL must be a string." })
  @IsOptional()
  @AutoMap()
  public xUrl!: string

  @ApiProperty({
    description: "YouTube channel URL",
    example: "https://youtube.com/@johndoe"
  })
  @IsUrl(
    {
      protocols: ["http", "https"],
      host_whitelist: ["www.youtube.com", "youtube.com", "youtu.be"]
    },
    { message: "YouTube URL must be a valid URL." }
  )
  @MaxLength(200, { message: "YouTube URL must be at most 200 characters long." })
  @IsString({ message: "YouTube URL must be a string." })
  @IsOptional()
  @AutoMap()
  public youtubeUrl!: string

  @ApiProperty({
    enum: UserStatus,
    description: "Current status of the user account",
    example: UserStatus.ACTIVE
  })
  @AutoMap()
  public status!: UserStatus

  @ApiProperty({
    enum: UserRole,
    isArray: true,
    description: "Roles assigned to the user",
    example: [UserRole.STUDENT, UserRole.ADMIN]
  })
  @AutoMap(() => [String])
  public roles!: UserRole[]

  @ApiProperty({
    description: "Timestamp of the last login",
    example: "2024-01-15T10:30:00Z"
  })
  @AutoMap()
  public lastLoginAt!: Date

  @ApiProperty({
    description: "Timestamp when the user account was created",
    example: "2023-06-01T08:00:00Z"
  })
  @AutoMap()
  public createdAt!: Date
}
