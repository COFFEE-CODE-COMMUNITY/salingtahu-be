import { ApiPropertyOptional } from "@nestjs/swagger"

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: "First name of the user",
    example: "John",
  })
  public firstName?: string

  @ApiPropertyOptional({
    description: "Last name of the user",
    example: "Doe",
  })
  public lastName?: string

  @ApiPropertyOptional({
    description: "Email address of the user",
    example: "john.doe@example.com",
  })
  public email?: string

  @ApiPropertyOptional({
    description: "Professional headline or tagline",
    example: "Full Stack Developer | Tech Enthusiast",
  })
  public headline?: string

  @ApiPropertyOptional({
    description: "User biography or about section",
    example: "Passionate developer with 5+ years of experience in web development",
  })
  public biography?: string

  @ApiPropertyOptional({
    description: "Preferred language for the user",
    example: "en",
  })
  public language?: string

  @ApiPropertyOptional({
    description: "URL to the user profile picture",
    example: "https://example.com/profile/avatar.jpg",
  })
  public profilePictureUrl?: string

  @ApiPropertyOptional({
    description: "Personal or professional website URL",
    example: "https://johndoe.com",
  })
  public websiteUrl?: string

  @ApiPropertyOptional({
    description: "Facebook profile URL",
    example: "https://facebook.com/johndoe",
  })
  public facebookUrl?: string

  @ApiPropertyOptional({
    description: "Instagram profile URL",
    example: "https://instagram.com/johndoe",
  })
  public instagramUrl?: string

  @ApiPropertyOptional({
    description: "LinkedIn profile URL",
    example: "https://linkedin.com/in/johndoe",
  })
  public linkedinUrl?: string

  @ApiPropertyOptional({
    description: "TikTok profile URL",
    example: "https://tiktok.com/@johndoe",
  })
  public tiktokUrl?: string

  @ApiPropertyOptional({
    description: "X profile URL",
    example: "https://x.com/johndoe",
  })
  public xUrl?: string

  @ApiPropertyOptional({
    description: "YouTube channel URL",
    example: "https://youtube.com/johndoe",
  })
  public youtubeUrl?: string
}
