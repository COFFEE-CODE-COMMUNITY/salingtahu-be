import { ApiProperty } from "@nestjs/swagger"
import { UserForumDto } from "../user-forum.dto"

class ReplyItemDto {
  @ApiProperty({ example: "reply-456" })
  public id!: string

  @ApiProperty({ example: "thread-123" })
  public threadId!: string

  @ApiProperty({ example: "This is a reply" })
  public content!: string

  @ApiProperty({ type: UserForumDto, nullable: true })
  public user!: UserForumDto | null

  @ApiProperty({ example: 5, description: "Number of child replies" })
  public childCount!: number

  @ApiProperty({ example: "2025-01-15T10:30:00.000Z" })
  public createdAt!: Date

  @ApiProperty({ example: "2025-01-15T10:30:00.000Z" })
  public updatedAt!: Date
}

class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  public page!: number

  @ApiProperty({ example: 10 })
  public limit!: number

  @ApiProperty({ example: 50 })
  public total!: number

  @ApiProperty({ example: 5 })
  public totalPages!: number

  @ApiProperty({ example: true })
  public hasNextPage!: boolean

  @ApiProperty({ example: false })
  public hasPreviousPage!: boolean

  @ApiProperty({ example: "thread-123" })
  public threadId!: string
}

export class GetAllReplyByThreadResponseDto {
  @ApiProperty({ type: [ReplyItemDto] })
  public data!: ReplyItemDto[]

  @ApiProperty({ type: PaginationMetaDto })
  public meta!: PaginationMetaDto
}
