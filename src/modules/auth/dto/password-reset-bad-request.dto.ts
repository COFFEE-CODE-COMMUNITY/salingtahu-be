import { ApiProperty } from "@nestjs/swagger"
import { BadRequestResponseDto } from "../../../common/dto/bad-request-response.dto"

class PasswordResetErrorMessage {
  @ApiProperty({
    description: "List of validation error messages for the email field.",
    type: [String],
    example: ["Email is required.", "Email must be a valid email address."],
  })
  public email!: string[]
}

export class PasswordResetBadRequestDto extends BadRequestResponseDto<PasswordResetErrorMessage> {
  @ApiProperty({
    description: "Object containing detailed error messages for each field.",
    type: PasswordResetErrorMessage,
  })
  public errors!: PasswordResetErrorMessage
}
