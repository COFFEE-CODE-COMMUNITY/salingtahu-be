import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class CreateThreadDto {
  @MinLength(1, { message: "Title must be at least 1 characters long" })
  @IsNotEmpty({ message: "Title should not be empty" })
  @IsString({ message: "Title must be a string" })
  @ApiProperty({
    description: "Title for thread",
    example: "How to use javascript",
    minLength: 1,
    type: String,
    required: true,
  })
  public title!: string

  @MinLength(1, { message: "Content must be at least 1 characters long" })
  @IsNotEmpty({ message: "Content should not be empty" })
  @IsString({ message: "Content must be a string" })
  @ApiProperty({
    description: "Content body for thread",
    example: "I dont know how to use javascript for the first time...",
    minLength: 1,
    type: String,
    required: true,
  })
  public content!: string

  @MinLength(1, { message: "Category must be at least 1 characters long" })
  @IsNotEmpty({ message: "Category should not be empty" })
  @IsString({ message: "Category must be a string" })
  @ApiProperty({
    description: "Category for thread",
    example: "Tech",
    minLength: 1,
    type: String,
    required: true,
  })
  public category!: string
}
