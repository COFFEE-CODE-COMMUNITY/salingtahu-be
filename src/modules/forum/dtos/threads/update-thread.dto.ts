import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString, MinLength } from "class-validator"

export class UpdateThreadDto {
  @ApiProperty({
    description: "Title of the thread (optional).",
    example: "Updated: Understanding JavaScript Closures",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "title must be a string" })
  @MinLength(1, { message: "title must be at least 1 character long" })
  public title?: string

  @ApiProperty({
    description: "Content body of the thread (optional).",
    example: "After more research, closures are easier to understand when...",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "content must be a string" })
  @MinLength(1, { message: "content must be at least 1 character long" })
  public content?: string

  @ApiProperty({
    description: "Category of the thread (optional).",
    example: "JavaScript",
    required: false,
  })
  @IsOptional()
  @IsString({ message: "category must be a string" })
  public category?: string | null
}
