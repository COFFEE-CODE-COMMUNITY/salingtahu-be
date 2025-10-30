import { ApiProperty } from "@nestjs/swagger"
import { AutoMap } from "@automapper/classes"
import { ImageDto } from "../../../common/dto/image.dto"

export class UserForumDto {
  @ApiProperty({
    description: "Unique identifier of the user",
    example: "d1d7b712-cc43-46de-a8c9-22b3f5b0f681",
  })
  @AutoMap()
  public id!: string

  @ApiProperty({
    description: "First name of the user",
    example: "Andi",
  })
  @AutoMap()
  public firstname!: string

  @ApiProperty({
    description: "Primary profile picture metadata or null",
    example: {
      url: "https://cdn.salingtau.com/avatar/andi.jpg",
      width: 400,
      height: 400,
    },
  })
  @AutoMap(() => ImageDto)
  public profilePicture!: ImageDto | null
}
