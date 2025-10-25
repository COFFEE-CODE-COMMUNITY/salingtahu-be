import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class ApplyInstructorDto {
  @ApiProperty({
    description: "Professional headline or tagline for the instructor profile",
    example: "Senior Software Engineer | React & Node.js Expert",
    minLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  public headline!: string

  @ApiProperty({
    description: "Detailed biography explaining teaching experience and expertise",
    example:
      "I have been teaching web development for over 5 years with a focus on modern JavaScript frameworks. My courses have helped thousands of students land their dream jobs.",
    minLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  public biography!: string

  @ApiProperty({
    description: "Personal or professional website URL",
    example: "https://johndoe.com",
    required: false,
  })
  @IsString()
  public websiteUrl?: string

  @ApiProperty({
    description: "LinkedIn profile URL",
    example: "https://linkedin.com/in/johndoe",
    required: false,
  })
  @IsString()
  public linkedinUrl?: string
}
