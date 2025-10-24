import { ApiProperty } from "@nestjs/swagger"
import { BadRequestResponseDto } from "../../../../common/dto/bad-request-response.dto"

class DeleteReplyErrorMessage {
  @ApiProperty({
    description: "List of validation error messages for the replyId parameter.",
    type: [String],
    example: ["replyId must be a valid UUID", "replyId should not be empty"],
  })
  public replyId!: string[]

  @ApiProperty({
    description: "General error messages related to delete operation.",
    type: [String],
    example: ["You can only delete your own replies.", "Reply not found or already deleted."],
  })
  public general?: string[]
}

export class DeleteReplyBadResponseDto extends BadRequestResponseDto<DeleteReplyErrorMessage> {
  @ApiProperty({
    description: "Object containing detailed error messages for each field.",
    type: DeleteReplyErrorMessage,
  })
  public errors!: DeleteReplyErrorMessage
}
