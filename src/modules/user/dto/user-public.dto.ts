import { ApiProperty } from "@nestjs/swagger"

export class UserPublicDto {
  @ApiProperty({
    description: "First name of the user",
    example: "John",
  })
  public firstName!: string

  @ApiProperty({
    description: "Last name of the user",
    example: "Doe",
  })
  public lastName!: string

  @ApiProperty({
    description: "Professional headline or tagline",
    example: "Full Stack Developer | Tech Enthusiast",
  })
  public headline!: string

  @ApiProperty({
    description: "User biography or about section",
    example: "Passionate developer with 5+ years of experience in web development",
  })
  public biography!: string

  @ApiProperty({
    description: "URL to the user profile picture",
    example: "https://example.com/profile/avatar.jpg",
  })
  public profilePictureUrl!: string

  @ApiProperty({
    description: "Personal or professional website URL",
    example: "https://johndoe.com",
  })
  public websiteUrl!: string

  @ApiProperty({
    description: "Facebook profile URL",
    example: "https://facebook.com/johndoe",
  })
  public facebookUrl!: string

  @ApiProperty({
    description: "Instagram profile URL",
    example: "https://instagram.com/johndoe",
  })
  public instagramUrl!: string

  @ApiProperty({
    description: "LinkedIn profile URL",
    example: "https://linkedin.com/in/johndoe",
  })
  public linkedinUrl!: string

  @ApiProperty({
    description: "TikTok profile URL",
    example: "https://tiktok.com/@johndoe",
  })
  public tiktokUrl!: string

  @ApiProperty({
    description: "X (formerly Twitter) profile URL",
    example: "https://x.com/johndoe",
  })
  public xUrl!: string

  @ApiProperty({
    description: "YouTube channel URL",
    example: "https://youtube.com/@johndoe",
  })
  public youtubeUrl!: string
}
