import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, Length } from "class-validator"

export class PasswordResetDto {
  @ApiProperty({
    description: "Email address of the user requesting a password reset.",
    example: "user@example.com",
    minLength: 1,
    maxLength: 100,
    required: true,
  })
  @IsEmail({}, { message: "Email must be a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  @Length(1, 100, { message: "Email length must be between 1 and 100 characters" })
  public email!: string
}
