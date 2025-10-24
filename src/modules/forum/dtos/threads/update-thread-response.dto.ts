import { ApiProperty } from "@nestjs/swagger"
import { UserForumDto } from "../user-forum.dto"

export class UpdateThreadResponseDto {
  @ApiProperty({
    description: "Unique identifier of the updated thread.",
    example: "c4c5e1a2-2d21-49bb-87e3-f6d2c4a4f5c1",
  })
  public id!: string

  @ApiProperty({
    description: "Updated title of the thread.",
    example: "Updated: Understanding JavaScript Closures",
  })
  public title!: string

  @ApiProperty({
    description: "Updated content of the thread.",
    example: "After more research, closures are easier to understand when...",
  })
  public content!: string

  @ApiProperty({
    description: "Updated category of the thread.",
    example: "JavaScript",
    nullable: true,
  })
  public category!: string | null

  @ApiProperty({
    description: "User object representing the author of the thread.",
    type: UserForumDto,
    nullable: true,
  })
  public user!: UserForumDto | null

  @ApiProperty({
    description: "Total number of replies currently on this thread.",
    example: 8,
  })
  public repliesCount!: number

  @ApiProperty({
    description: "Timestamp when the thread was created.",
    example: "2025-10-23T18:30:00.000Z",
  })
  public createdAt!: Date

  @ApiProperty({
    description: "Timestamp when the thread was last updated.",
    example: "2025-10-23T19:10:00.000Z",
  })
  public updatedAt!: Date
}
