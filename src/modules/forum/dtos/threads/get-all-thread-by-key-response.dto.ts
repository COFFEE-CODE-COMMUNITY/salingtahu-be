import { ApiProperty } from "@nestjs/swagger"
import { UserForumDto } from "../user-forum.dto"

class ThreadItemDto {
  @ApiProperty({
    example: "thread-456",
    description: "Thread ID",
  })
  public id!: string

  @ApiProperty({
    example: "How to learn TypeScript?",
    description: "Thread title",
  })
  public title!: string

  @ApiProperty({
    example: "I want to learn TypeScript, any recommendations?",
    description: "Thread content",
  })
  public content!: string

  @ApiProperty({
    example: "tech",
    description: "Thread category",
  })
  public category!: string

  @ApiProperty({
    example: 5,
    description: "Number of replies",
  })
  public repliesCount!: number

  @ApiProperty({
    type: UserForumDto,
    description: "Thread author information",
  })
  public user!: UserForumDto

  @ApiProperty({
    example: "2025-01-15T10:30:00.000Z",
    description: "Thread creation timestamp",
  })
  public createdAt!: Date

  @ApiProperty({
    example: "2025-01-15T10:30:00.000Z",
    description: "Thread last update timestamp",
  })
  public updatedAt!: Date
}

class PaginationMetaDto {
  @ApiProperty({
    example: 1,
    description: "Current page number",
  })
  public page!: number

  @ApiProperty({
    example: 10,
    description: "Number of items per page",
  })
  public limit!: number

  @ApiProperty({
    example: 50,
    description: "Total number of items",
  })
  public total!: number

  @ApiProperty({
    example: 5,
    description: "Total number of pages",
  })
  public totalPages!: number

  @ApiProperty({
    example: true,
    description: "Whether there is a next page",
  })
  public hasNextPage!: boolean

  @ApiProperty({
    example: false,
    description: "Whether there is a previous page",
  })
  public hasPreviousPage!: boolean
}

class PaginationMetaWithSearchDto extends PaginationMetaDto {
  @ApiProperty({
    example: "javascript",
    description: "Search keyword used",
    nullable: true,
  })
  public searchKey!: string | null
}

export class GetAllThreadByKeyResponseDto {
  @ApiProperty({
    type: [ThreadItemDto],
    description: "List of threads matching search criteria",
  })
  public data!: ThreadItemDto[]

  @ApiProperty({
    type: PaginationMetaWithSearchDto,
    description: "Pagination metadata with search info",
  })
  public meta!: PaginationMetaWithSearchDto
}
