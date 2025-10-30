import { ApiProperty } from "@nestjs/swagger"
import { ThreadResponseDto } from "./thread-response.dto"

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
    type: [ThreadResponseDto],
    description: "List of threads matching search criteria",
  })
  public data!: ThreadResponseDto[]

  @ApiProperty({
    type: PaginationMetaWithSearchDto,
    description: "Pagination metadata with search info",
  })
  public meta!: PaginationMetaWithSearchDto
}
