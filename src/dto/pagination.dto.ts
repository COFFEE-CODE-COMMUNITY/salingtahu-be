import { ApiProperty } from "@nestjs/swagger"

export class PaginationMetaDto {
  @ApiProperty({
    description: "Total number of items across all pages",
    example: 250,
    type: Number,
    minimum: 0
  })
  public totalItems!: number

  @ApiProperty({
    description: "Maximum number of items per page",
    example: 20,
    type: Number,
    minimum: 1
  })
  public limit!: number

  @ApiProperty({
    description: "Number of items to skip from the beginning",
    example: 0,
    type: Number,
    minimum: 0
  })
  public offset!: number

  @ApiProperty({
    description: "Total number of pages available",
    example: 13,
    type: Number,
    minimum: 0
  })
  public totalPages!: number
}

export class PaginationLinksDto {
  @ApiProperty({
    description: "URL to the first page of results",
    example: "/api/courses?limit=20&offset=0",
    type: String
  })
  public first!: string

  @ApiProperty({
    description: "URL to the previous page of results, null if on first page",
    example: "/api/courses?limit=20&offset=0",
    type: String,
    nullable: true
  })
  public previous!: string | null

  @ApiProperty({
    description: "URL to the next page of results, null if on last page",
    example: "/api/courses?limit=20&offset=40",
    type: String,
    nullable: true
  })
  public next!: string | null

  @ApiProperty({
    description: "URL to the last page of results",
    example: "/api/courses?limit=20&offset=240",
    type: String
  })
  public last!: string
}

export class PaginationDto<T> {
  @ApiProperty({
    description: "Array of paginated items",
    isArray: true
  })
  public data!: T[]

  @ApiProperty({
    description: "Metadata about the pagination",
    type: () => PaginationMetaDto
  })
  public meta!: PaginationMetaDto

  @ApiProperty({
    description: "Links to navigate through paginated results",
    type: () => PaginationLinksDto
  })
  public links!: PaginationLinksDto
}
