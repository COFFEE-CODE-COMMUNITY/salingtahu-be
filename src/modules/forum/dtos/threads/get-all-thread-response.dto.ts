import { ApiProperty } from "@nestjs/swagger"
import { ThreadResponseDto } from "./thread-response.dto"

export class GetAllThreadResponseDto {
  @ApiProperty({
    description: "Daftar thread yang tersedia di forum (1–15 item)",
    type: [ThreadResponseDto],
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
  public data!: ThreadResponseDto[]
}
