import { ApiProperty } from "@nestjs/swagger"
import { BadRequestResponseDto } from "../../../../common/dto/bad-request-response.dto"

class UpdateThreadErrorMessage {
  @ApiProperty({
    description: "Validation error messages for the title field.",
    type: [String],
    example: ["title must be a string", "title must be at least 1 character long"],
  })
  public title?: string[]

  @ApiProperty({
    description: "Validation error messages for the content field.",
    type: [String],
    example: ["content must be a string"],
  })
  public content?: string[]

  @ApiProperty({
    description: "Validation error messages for the category field.",
    type: [String],
    example: ["category must be a string"],
  })
  public category?: string[]

  @ApiProperty({
    description: "General or contextual errors not tied to a specific field.",
    type: [String],
    example: ["You can only update your own threads.", "Thread not found or already deleted."],
  })
  public general?: string[]
}

export class UpdateThreadBadRequestDto extends BadRequestResponseDto<UpdateThreadErrorMessage> {
  @ApiProperty({
    description: "Object containing detailed error messages for each invalid field.",
    type: UpdateThreadErrorMessage,
  })
  public errors!: UpdateThreadErrorMessage
}
