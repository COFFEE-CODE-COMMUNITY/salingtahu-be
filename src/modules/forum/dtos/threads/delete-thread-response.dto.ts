import { ApiProperty } from "@nestjs/swagger"

export class DeleteThreadResponseDto {
  @ApiProperty({
    description: "Unique identifier of the thread",
    example: "a23f4c56-9d7e-4b31-a8e2-16d4bc29e91d",
  })
  public id!: string

  @ApiProperty({
    description: "Timestamp when this thread was deleted",
    example: "2025-10-23T19:40:00.000Z",
  })
  public deletedAt!: Date | null
}
