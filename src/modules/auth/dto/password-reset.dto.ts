import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator"
import { Exists } from "../../../validators/exists.decorator"
import { User } from "../../user/entities/user.entity"

export class PasswordResetDto {
  @ApiProperty({
    description: "Email address of the user requesting a password reset.",
    example: "user@example.com",
    minLength: 1,
    maxLength: 100,
    required: true
  })
  @Exists(User, "email", { message: "Email does not exists" })
  @Length(1, 100, { message: "Email length must be between 1 and 100 characters" })
  @IsEmail({}, { message: "Email must be a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  @IsString({ message: "Email must be a string" })
  public email!: string
}
