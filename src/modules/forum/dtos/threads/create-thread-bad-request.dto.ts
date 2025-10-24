import { ApiProperty } from "@nestjs/swagger"
import { BadRequestResponseDto } from "../../../../common/dto/bad-request-response.dto"

class CreateThreadErrorMessage {
  @ApiProperty({
    description: "List of validation error messages for the title field.",
    type: [String],
    example: ["Title should not be empty", "Title must be at least 1 characters long"],
  })
  public title!: string[]

  @ApiProperty({
    description: "List of validation error messages for the content field.",
    type: [String],
    example: ["Content should not be empty", "Content must be at least 1 characters long"],
  })
  public content!: string[]

  @ApiProperty({
    description: "List of validation error messages for the category field.",
    type: [String],
    example: ["Category should not be empty", "Category must be at least 1 characters long"],
  })
  public category!: string[]
}

export class CreateThreadBadRequestDto extends BadRequestResponseDto<CreateThreadErrorMessage> {
  @ApiProperty({
    description: "Object containing detailed error messages for each field.",
    type: CreateThreadErrorMessage,
  })
  public errors!: CreateThreadErrorMessage
}
