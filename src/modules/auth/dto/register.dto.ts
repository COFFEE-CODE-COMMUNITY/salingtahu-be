import { IsEmail, IsString, MinLength, IsNotEmpty, MaxLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { AutoMap } from "@automapper/classes"
import { Unique } from "../../../common/validators/unique.decorator"
import { User } from "../../user/entities/user.entity"

export class RegisterDto {
  @MaxLength(30, { message: "First name must be at most 30 characters long" })
  @MinLength(2, { message: "First name must be at least 2 characters long" })
  @IsNotEmpty({ message: "First name should not be empty" })
  @IsString({ message: "First name must be a string" })
  @ApiProperty({
    description: "First name of the user",
    example: "John",
    minLength: 2,
    maxLength: 30,
    required: true,
  })
  @AutoMap()
  public firstName!: string

  @MaxLength(30, { message: "Last name must be at most 30 characters long" })
  @MinLength(2, { message: "Last name must be at least 2 characters long" })
  @IsNotEmpty({ message: "Last name should not be empty" })
  @IsString({ message: "Last name must be a string" })
  @ApiProperty({
    description: "Last name of the user",
    example: "Doe",
    minLength: 2,
    maxLength: 30,
    required: true,
  })
  @AutoMap()
  public lastName!: string

  @Unique(User, "email", { message: "Email already in use" })
  @MaxLength(50, { message: "Email must be at most 50 characters long" })
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email should not be empty" })
  @IsString({ message: "Email must be a string" })
  @ApiProperty({
    description: "Email address for the new account",
    example: "johndoe@example.com",
    format: "email",
    maxLength: 50,
    required: true,
  })
  @AutoMap()
  public email!: string

  @MaxLength(100, { message: "Password must be at most 100 characters long" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @IsNotEmpty({ message: "Password should not be empty" })
  @IsString({ message: "Password must be a string" })
  @ApiProperty({
    description: "Password for the new account",
    example: "SecurePass123!",
    minLength: 8,
    maxLength: 100,
    required: true,
  })
  @AutoMap()
  public password!: string
}
