import { ApiProperty } from "@nestjs/swagger"
import { UserForumDto } from "../user-forum.dto"

class ParentReplyDto {
  @ApiProperty({ example: "reply-123" })
  public id!: string

  @ApiProperty({ example: "This is the parent reply" })
  public content!: string

  @ApiProperty({ type: UserForumDto, nullable: true })
  public user!: UserForumDto | null
}

class ChildReplyItemDto {
  @ApiProperty({ example: "reply-789" })
  public id!: string

  @ApiProperty({ example: "thread-123" })
  public threadId!: string

  @ApiProperty({ example: "This is a nested reply" })
  public content!: string

  @ApiProperty({ type: UserForumDto, nullable: true })
  public user!: UserForumDto | null

  @ApiProperty({ type: ParentReplyDto })
  public parent!: ParentReplyDto | null

  @ApiProperty({ example: "2025-01-15T10:30:00.000Z" })
  public createdAt!: Date

  @ApiProperty({ example: "2025-01-15T10:30:00.000Z" })
  public updatedAt!: Date
}

class ChildrenPaginationMetaDto {
  @ApiProperty({ example: 1 })
  public page!: number

  @ApiProperty({ example: 10 })
  public limit!: number

  @ApiProperty({ example: 3 })
  public total!: number

  @ApiProperty({ example: 1 })
  public totalPages!: number

  @ApiProperty({ example: false })
  public hasNextPage!: boolean

  @ApiProperty({ example: false })
  public hasPreviousPage!: boolean

  @ApiProperty({ example: "reply-123", description: "Parent reply ID" })
  public parentReplyId!: string
}

export class GetAllChildrenReplyResponseDto {
  @ApiProperty({ type: [ChildReplyItemDto] })
  public data!: ChildReplyItemDto[]

  @ApiProperty({ type: ChildrenPaginationMetaDto })
  public meta!: ChildrenPaginationMetaDto
}
