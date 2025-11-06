import { ApiProperty } from "@nestjs/swagger"
import { AutoMap } from "@automapper/classes"

export class ImageDto {
  @ApiProperty({
    description: "URL of the image",
    example: "https://example.com/images/photo.jpg",
    type: String
  })
  @AutoMap()
  public url!: string

  @ApiProperty({
    description: "Width of the image in pixels",
    example: 1920,
    type: Number,
    minimum: 1
  })
  @AutoMap()
  public width!: number

  @ApiProperty({
    description: "Height of the image in pixels",
    example: 1080,
    type: Number,
    minimum: 1
  })
  @AutoMap()
  public height!: number
}
