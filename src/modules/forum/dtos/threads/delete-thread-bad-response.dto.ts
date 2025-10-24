import { ApiProperty } from "@nestjs/swagger"
import { BadRequestResponseDto } from "../../../../common/dto/bad-request-response.dto"

class DeleteThreadErrorMessage {
  @ApiProperty({
    description: "List of validation error messages for the threadId parameter.",
    type: [String],
    example: ["threadId must be a valid UUID", "threadId should not be empty"],
  })
  public threadId!: string[]

  @ApiProperty({
    description: "General error messages related to thread delete operation.",
    type: [String],
    example: ["You can only delete your own threads.", "Thread not found or already deleted."],
  })
  public general?: string[]
}

export class DeleteThreadBadResponseDto extends BadRequestResponseDto<DeleteThreadErrorMessage> {
  @ApiProperty({
    description: "Object containing detailed error messages for each field.",
    type: DeleteThreadErrorMessage,
  })
  public errors!: DeleteThreadErrorMessage
}
