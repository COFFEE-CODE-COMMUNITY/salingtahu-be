import { ApiProperty } from "@nestjs/swagger"
import { Allow } from "class-validator"

export class LoginDto {
  @ApiProperty({
    description: "Email address for login account",
    example: "johndoe@example.com",
    format: "email",
    maxLength: 50,
    type: String,
  })
  @Allow()
  public email!: string

  @ApiProperty({
    description: "Password for login account",
    example: "SecurePass123!",
    minLength: 8,
    maxLength: 100,
    type: String,
  })
  @Allow()
  public password!: string
}
