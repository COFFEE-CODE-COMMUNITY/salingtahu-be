import { ApiProperty } from "@nestjs/swagger"
import { BadRequestResponseDto } from "../../../common/dto/bad-request-response.dto"


class RegisterBadRequestErrorMessages {
  @ApiProperty({
    description: 'Validation errors for the username field',
    example: [
      'Username must be at least 4 characters long',
      'Username must be at most 20 characters long',
      'Username should not be empty',
      'Username must be a string',
    ],
    type: [String],
    required: false,
  })
  public username!: string[]

  @ApiProperty({
    description: 'Validation errors for the email field',
    example: [
      'Invalid email format',
      'Email must be at most 50 characters long',
      'Email should not be empty',
      'Email must be a string',
    ],
    type: [String],
    required: false,
  })
  public email!: string[]

  @ApiProperty({
    description: 'Validation errors for the password field',
    example: [
      'Password must be at least 8 characters long',
      'Password must be at most 100 characters long',
      'Password should not be empty',
      'Password must be a string',
    ],
    type: [String],
    required: false,
  })
  public password!: string[]
}

export class RegisterBadRequestResponseDto extends BadRequestResponseDto<RegisterBadRequestErrorMessages> {
  @ApiProperty({
    description: 'Detailed validation errors for each field in the registration form',
    type: RegisterBadRequestErrorMessages,
    example: {
      username: ['Username must be at least 4 characters long'],
      email: ['Invalid email format'],
      password: ['Password must be at least 8 characters long'],
    },
  })
  public errors!: RegisterBadRequestErrorMessages
}