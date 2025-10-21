import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsBoolean } from "class-validator"

export class ChangePasswordDto {
  @ApiProperty({
    description: "The new password to set.",
    example: "P@ssw0rd!",
    minLength: 1,
    maxLength: 100,
    required: true,
  })
  @IsNotEmpty({ message: "Password is required" })
  public password!: string

  @ApiProperty({
    description: "Confirmation of the new password.",
    example: "P@ssw0rd!",
    minLength: 1,
    maxLength: 100,
    required: true,
  })
  public confirmPassword!: string

  @ApiProperty({
    description: "If true, the user will be logged out from all login session after password reset.",
    example: true,
    required: false,
    default: false,
  })
  @IsBoolean()
  public logoutAll: boolean = false
}
