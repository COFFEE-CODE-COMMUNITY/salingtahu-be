import { ApiProperty } from "@nestjs/swagger"
import { UserForumDto } from "../user-forum.dto"

export class UpdateReplyResponseDto {
  @ApiProperty({
    description: "Unique identifier of the updated reply",
    example: "c9a2f2a0-48de-4f20-8aef-12a3a4cb5b6d",
  })
  public id!: string

  @ApiProperty({
    description: "Identifier of the thread this reply belongs to",
    example: "c4c5e1a2-2d21-49bb-87e3-f6d2c4a4f5c1",
  })
  public threadId!: string

  @ApiProperty({
    description: "Identifier of the parent reply, if it exists",
    example: "a1b2c3d4-5678-90ab-cdef-1234567890ab",
    nullable: true,
  })
  public parentReplyId?: string | null

  @ApiProperty({
    description: "Updated text content of the reply",
    example: "I’ve changed my opinion after reading the documentation again.",
  })
  public content!: string

  @ApiProperty({
    description: "User object representing the author of this reply",
    type: UserForumDto,
    nullable: true,
  })
  public user!: UserForumDto | null

  @ApiProperty({
    description: "Timestamp when the reply was created",
    example: "2025-10-23T18:30:00.000Z",
  })
  public createdAt!: Date

  @ApiProperty({
    description: "Timestamp when the reply was last updated",
    example: "2025-10-23T19:10:00.000Z",
  })
  public updatedAt!: Date
}
