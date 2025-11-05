import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsBoolean, IsString, MinLength, MaxLength } from "class-validator"
import { Match } from "../../../validators/match.decorator"
import { NotSameAsCurrentPassword } from "../validators/not-same-as-current-password.decorator"

export class ChangePasswordDto {
  @ApiProperty({
    description: "The new password to set.",
    example: "P@ssw0rd!",
    minLength: 1,
    maxLength: 100,
    required: true
  })
  @NotSameAsCurrentPassword()
  @MaxLength(100, { message: "Password must be at most 100 characters long" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @IsNotEmpty({ message: "Password is required" })
  @IsString({ message: "Password must be a string" })
  public password!: string

  @ApiProperty({
    description: "Confirmation of the new password.",
    example: "P@ssw0rd!",
    minLength: 1,
    maxLength: 100,
    required: true
  })
  @Match("password", { message: "Confirm password must match password" })
  @MaxLength(100, { message: "Confirm password must be at most 100 characters long" })
  @MinLength(8, { message: "Confirm password must be at least 8 characters long" })
  @IsNotEmpty({ message: "Confirm password is required" })
  @IsString({ message: "Confirm password must be a string" })
  public confirmPassword!: string

  @ApiProperty({
    description: "If true, the user will be logged out from all login session after password reset.",
    example: true,
    required: false,
    default: false
  })
  @IsBoolean({ message: "Logout all must be a boolean value" })
  public logoutAll: boolean = false
}
