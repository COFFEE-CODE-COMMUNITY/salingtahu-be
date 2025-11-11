import { ApiProperty } from "@nestjs/swagger"
import { ImageDto } from "../../../dto/image.dto"
import { AutoMap } from "@automapper/classes"

export class UserPublicDto {
  @ApiProperty({
    description: "First name of the user",
    example: "John"
  })
  @AutoMap()
  public firstName!: string

  @ApiProperty({
    description: "Last name of the user",
    example: "Doe"
  })
  @AutoMap()
  public lastName!: string

  @ApiProperty({
    description: "Professional headline or tagline",
    example: "Full Stack Developer | Tech Enthusiast"
  })
  @AutoMap()
  public headline!: string

  @ApiProperty({
    description: "User biography or about section",
    example: "Passionate developer with 5+ years of experience in web development"
  })
  @AutoMap()
  public biography!: string

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
  @AutoMap(() => [ImageDto])
  public profilePictures!: ImageDto[]

  @ApiProperty({
    description: "Personal or professional website URL",
    example: "https://johndoe.com"
  })
  @AutoMap()
  public websiteUrl!: string

  @ApiProperty({
    description: "Facebook profile URL",
    example: "https://facebook.com/johndoe"
  })
  @AutoMap()
  public facebookUrl!: string

  @ApiProperty({
    description: "Instagram profile URL",
    example: "https://instagram.com/johndoe"
  })
  @AutoMap()
  public instagramUrl!: string

  @ApiProperty({
    description: "LinkedIn profile URL",
    example: "https://linkedin.com/in/johndoe"
  })
  @AutoMap()
  public linkedinUrl!: string

  @ApiProperty({
    description: "TikTok profile URL",
    example: "https://tiktok.com/@johndoe"
  })
  @AutoMap()
  public tiktokUrl!: string

  @ApiProperty({
    description: "X (formerly Twitter) profile URL",
    example: "https://x.com/johndoe"
  })
  @AutoMap()
  public xUrl!: string

  @ApiProperty({
    description: "YouTube channel URL",
    example: "https://youtube.com/@johndoe"
  })
  @AutoMap()
  public youtubeUrl!: string
}
