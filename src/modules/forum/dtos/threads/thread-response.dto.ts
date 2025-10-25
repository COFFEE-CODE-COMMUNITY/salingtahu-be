import { ApiProperty } from "@nestjs/swagger"
import { UserForumDto } from "../user-forum.dto"
import { AutoMap } from "@automapper/classes"

export class ThreadResponseDto {
  @ApiProperty({
    description: "UUID unik dari thread",
    example: "e7e2a1a4-53f3-4ed2-a6c5-ff98b1a7e931",
  })
  @AutoMap()
  public id!: string

  @ApiProperty({
    description: "Judul thread",
    example: "Diskusi Kopi Indonesia",
  })
  @AutoMap()
  public title!: string

  @ApiProperty({
    description: "Isi konten thread",
    example: "Kalian lebih suka arabika atau robusta?",
  })
  @AutoMap()
  public content!: string

  @ApiProperty({
    description: "Kategori topik thread",
    example: "coffee",
    nullable: true,
  })
  @AutoMap()
  public category!: string | null

  @ApiProperty({
    description: "Jumlah total balasan (reply) di thread ini",
    example: 0,
  })
  @AutoMap()
  public repliesCount!: number

  @ApiProperty({
    description: "Data user pembuat thread",
    type: UserForumDto,
  })
  @AutoMap()
  public user!: UserForumDto

  @ApiProperty({
    description: "Waktu pembuatan thread (ISO 8601)",
    example: "2025-10-23T10:00:00.000Z",
  })
  @AutoMap()
  public createdAt!: Date

  @ApiProperty({
    description: "Waktu terakhir update thread (ISO 8601)",
    example: "2025-10-23T10:00:00.000Z",
  })
  @AutoMap()
  public updatedAt!: Date
}
