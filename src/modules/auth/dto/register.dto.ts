import { IsEmail, IsString, MinLength, IsNotEmpty, MaxLength } from 'class-validator'

export class RegisterDto {

  @MaxLength(20, { message: "Username must be at most 20 characters long" })
  @MinLength(4, { message: "Username must be at least 4 characters long" })
  @IsNotEmpty({ message: "Username should not be empty" })
  @IsString({ message: "Username must be a string" })
  public username!: string

  @MaxLength(50, { message: "Email must be at most 50 characters long" })
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email should not be empty" })
  @IsString({ message: "Email must be a string" })
  public email!: string

  @MaxLength(100, { message: "Password must be at most 100 characters long" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @IsNotEmpty({ message: "Password should not be empty" })
  @IsString({ message: "Password must be a string" })
  public password!: string
}