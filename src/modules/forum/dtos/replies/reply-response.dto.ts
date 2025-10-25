import { ApiProperty } from "@nestjs/swagger"
import { UserForumDto } from "../user-forum.dto"
import { AutoMap } from "@automapper/classes"

export class ReplyResponseDto {
  @ApiProperty({
    description: "Unique identifier of the reply",
    example: "b78a4f67-0c25-4e8b-a0e7-9b92f31c9a1c",
  })
  @AutoMap()
  public id!: string

  @ApiProperty({
    description: "Identifier of the thread this reply belongs to",
    example: "ffb8df02-3d6f-4ed5-8f2a-f1a6e2b25b9b",
  })
  @AutoMap()
  public threadId!: string

  @ApiProperty({
    description: "Identifier of the parent reply if this is a nested reply",
    example: "d1a2f82a-1248-4c5f-81d5-f98af4db3e99",
    nullable: true,
  })
  @AutoMap()
  public parentReplyId?: string | null

  @ApiProperty({
    description: "Text content of the reply",
    example: "I totally agree with your explanation about async/await!",
  })
  @AutoMap()
  public content!: string

  @ApiProperty({
    description: "User object representing the author of the reply",
    type: UserForumDto,
    nullable: true,
  })
  @AutoMap()
  public user!: UserForumDto | null

  @ApiProperty({
    description: "Timestamp when this reply was created",
    example: "2025-10-23T18:30:00.000Z",
  })
  @AutoMap()
  public createdAt!: Date

  @ApiProperty({
    description: "Timestamp when this reply was last updated",
    example: "2025-10-23T19:10:00.000Z",
  })
  @AutoMap()
  public updatedAt!: Date
}
