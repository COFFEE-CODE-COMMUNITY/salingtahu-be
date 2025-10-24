import { ApiProperty } from "@nestjs/swagger"
import { UserForumDto } from "../user-forum.dto"

class ThreadItemDto {
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
    example: 12,
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

export class GetAllThreadResponseDto {
  @ApiProperty({
    description: "Daftar thread yang tersedia di forum (1–15 item)",
    type: [ThreadItemDto],
    example: Array.from({ length: 15 }).map((_, i) => ({
      id: `00000000-0000-0000-0000-0000000000${(i + 1).toString().padStart(2, "0")}`,
      title: `Topik Diskusi #${i + 1}`,
      content: `Ini adalah konten contoh untuk thread ke-${i + 1}.`,
      category: i % 3 === 0 ? "Web Development" : i % 3 === 1 ? "AI & ML" : "Design",
      repliesCount: Math.floor(Math.random() * 50),
      user: {
        id: `user-${i + 1}`,
        username: `User ${i + 1}`,
        profilePicturePath: `https://api.dicebear.com/7.x/avatars/svg?seed=${i + 1}`,
      },
      createdAt: `2025-10-23T10:${String(i).padStart(2, "0")}:00.000Z`,
      updatedAt: `2025-10-23T10:${String(i).padStart(2, "0")}:00.000Z`,
    })),
  })
  public data!: ThreadItemDto[]
}
