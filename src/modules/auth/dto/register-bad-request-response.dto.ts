import { ApiProperty } from "@nestjs/swagger"
import { BadRequestResponseDto } from "../../../common/dto/bad-request-response.dto"

class RegisterBadRequestErrorMessages {
  @ApiProperty({
    description: "Validation errors for the first name field",
    example: [
      "First name must be at most 30 characters long",
      "First name must be at least 2 characters long",
      "First name should not be empty",
      "First name must be a string",
    ],
    type: [String],
    required: false,
  })
  public firstName!: string[]

  @ApiProperty({
    description: "Validation errors for the last name field",
    example: [
      "Last name must be at most 30 characters long",
      "Last name must be at least 2 characters long",
      "Last name should not be empty",
      "Last name must be a string",
    ],
    type: [String],
    required: false,
  })
  public lastName!: string[]

  @ApiProperty({
    description: "Validation errors for the email field",
    example: [
      "Invalid email format",
      "Email must be at most 50 characters long",
      "Email should not be empty",
      "Email must be a string",
    ],
    type: [String],
    required: false,
  })
  public email!: string[]

  @ApiProperty({
    description: "Validation errors for the password field",
    example: [
      "Password must be at least 8 characters long",
      "Password must be at most 100 characters long",
      "Password should not be empty",
      "Password must be a string",
    ],
    type: [String],
    required: false,
  })
  public password!: string[]
}

export class RegisterBadRequestResponseDto extends BadRequestResponseDto<RegisterBadRequestErrorMessages> {
  @ApiProperty({
    description: "Detailed validation errors for each field in the registration form",
    type: RegisterBadRequestErrorMessages,
    example: {
      username: ["Username must be at least 4 characters long"],
      email: ["Invalid email format"],
      password: ["Password must be at least 8 characters long"],
    },
  })
  public errors!: RegisterBadRequestErrorMessages
}
