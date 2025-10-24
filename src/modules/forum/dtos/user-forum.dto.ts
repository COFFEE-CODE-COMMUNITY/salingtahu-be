import { ApiProperty } from "@nestjs/swagger"

export class UserForumDto {
  @ApiProperty({
    description: "Unique ID dari user yang membuat thread",
    example: "8cfe8d3e-1b6a-4b4c-b7e9-4bbf37a5e7aa",
  })
  public id!: string

  @ApiProperty({
    description: "Nama atau username pembuat thread",
    example: "Andi Pratama",
  })
  public username!: string

  @ApiProperty({
    description: "URL avatar user",
    example: "https://cdn.example.com/avatars/andi.png",
    nullable: true,
  })
  public avatarUrl?: string | null
}
