import { IsEmail, IsString, MinLength, IsNotEmpty, MaxLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class LoginDto {
  @MaxLength(50, { message: "Email must be at most 50 characters long" })
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email should not be empty" })
  @IsString({ message: "Email must be a string" })
  @ApiProperty({
    description: "Email address for login account",
    example: "johndoe@example.com",
    format: "email",
    maxLength: 50,
    type: String,
  })
  public email!: string

  @MaxLength(100, { message: "Password must be at most 100 characters long" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @IsNotEmpty({ message: "Password should not be empty" })
  @IsString({ message: "Password must be a string" })
  @ApiProperty({
    description: "Password for login account",
    example: "SecurePass123!",
    minLength: 8,
    maxLength: 100,
    type: String,
  })
  public password!: string
}
