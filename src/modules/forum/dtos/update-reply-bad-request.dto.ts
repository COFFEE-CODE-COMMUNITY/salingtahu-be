import { ApiProperty } from "@nestjs/swagger"
import { BadRequestResponseDto } from "../../../common/dto/bad-request-response.dto"

class UpdateReplyErrorMessage {
  @ApiProperty({
    description: "Validation error messages for the content field",
    type: [String],
    example: ["content must be a string", "content should not be empty", "content must be at least 1 character long"],
  })
  public content?: string[]

  @ApiProperty({
    description: "General or contextual error messages not tied to a specific field",
    type: [String],
    example: ["You can only update your own replies.", "Reply not found or already deleted."],
  })
  public general?: string[]
}

export class UpdateReplyBadRequestDto extends BadRequestResponseDto<UpdateReplyErrorMessage> {
  @ApiProperty({
    description: "Object containing detailed error messages for each field",
    type: UpdateReplyErrorMessage,
  })
  public errors!: UpdateReplyErrorMessage
}
