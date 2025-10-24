import { ApiProperty } from "@nestjs/swagger"
import { UserForumDto } from "../user-forum.dto"

export class CreateThreadResponseDto {
  @ApiProperty({
    description: "UUID unik dari thread",
    example: "e7e2a1a4-53f3-4ed2-a6c5-ff98b1a7e931",
  })
  public id!: string

  @ApiProperty({
    description: "Judul thread",
    example: "Diskusi Kopi Indonesia",
  })
  public title!: string

  @ApiProperty({
    description: "Isi konten thread",
    example: "Kalian lebih suka arabika atau robusta?",
  })
  public content!: string

  @ApiProperty({
    description: "Kategori topik thread",
    example: "coffee",
    nullable: true,
  })
  public category!: string | null

  @ApiProperty({
    description: "Jumlah total balasan (reply) di thread ini",
    example: 0,
  })
  public repliesCount!: number

  @ApiProperty({
    description: "Data user pembuat thread",
    type: UserForumDto,
  })
  public user!: UserForumDto

  @ApiProperty({
    description: "Waktu pembuatan thread (ISO 8601)",
    example: "2025-10-23T10:00:00.000Z",
  })
  public createdAt!: Date

  @ApiProperty({
    description: "Waktu terakhir update thread (ISO 8601)",
    example: "2025-10-23T10:00:00.000Z",
  })
  public updatedAt!: Date
}
