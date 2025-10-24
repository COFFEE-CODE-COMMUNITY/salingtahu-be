import { ApiProperty } from "@nestjs/swagger"

export class DeleteReplyResponseDto {
  @ApiProperty({
    description: "Unique identifier of the reply",
    example: "b78a4f67-0c25-4e8b-a0e7-9b92f31c9a1c",
  })
  public id!: string

  @ApiProperty({
    description: "Timestamp when this reply was last deleted",
    example: "2025-10-23T19:10:00.000Z",
  })
  public deletedAt!: Date | null
}
