import { ApiProperty } from "@nestjs/swagger"

export class CreateThreadDto {
  @ApiProperty({
    description: "Title for thread",
    example: "How to use javascript",
    type: String,
    required: true,
  })
  public title!: string

  @ApiProperty({
    description: "Content body for thread",
    example: "I dont know how to use javascript for the first time...",
    type: String,
    required: true,
  })
  public content!: string

  @ApiProperty({
    description: "Category for thread",
    example: "Tech",
    type: String,
    required: true,
  })
  public category!: string
}
