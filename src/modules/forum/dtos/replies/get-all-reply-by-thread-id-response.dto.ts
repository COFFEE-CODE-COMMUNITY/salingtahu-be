import { ApiProperty } from "@nestjs/swagger"
import { ReplyResponseDto } from "./reply-response.dto"

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
  @ApiProperty({ type: [ReplyResponseDto] })
  public data!: ReplyResponseDto[]

  @ApiProperty({ type: PaginationMetaDto })
  public meta!: PaginationMetaDto
}
