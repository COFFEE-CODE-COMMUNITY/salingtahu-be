import { ApiProperty } from "@nestjs/swagger"
import { BadRequestResponseDto } from "../../../common/dto/bad-request-response.dto"

class CreateReplyErrorMessage {
  @ApiProperty({
    description: "List of validation error messages for the threadId field.",
    type: [String],
    example: ["threadId should not empty", "threadId must be a valid UUID"],
  })
  public threadId!: string[]

  @ApiProperty({
    description: "List of validation error messages for the parentReplyId field.",
    type: [String],
    example: ["parentReplyId must be a valid UUID"],
  })
  public parentReplyId!: string[]

  @ApiProperty({
    description: "List of validation error messages for the content field.",
    type: [String],
    example: ["content should not empty", "content must be a string"],
  })
  public content!: string[]
}

export class CreateReplyBadRequestDto extends BadRequestResponseDto<CreateReplyErrorMessage> {
  @ApiProperty({
    description: "Object containing detailed error messages for each field.",
    type: CreateReplyErrorMessage,
  })
  public errors!: CreateReplyErrorMessage
}
