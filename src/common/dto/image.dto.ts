import { ApiProperty } from "@nestjs/swagger"

export class ImageDto {
  @ApiProperty({
    description: "URL of the image",
    example: "https://example.com/images/photo.jpg",
    type: String,
  })
  public url!: string

  @ApiProperty({
    description: "Width of the image in pixels",
    example: 1920,
    type: Number,
    minimum: 1,
  })
  public width!: number

  @ApiProperty({
    description: "Height of the image in pixels",
    example: 1080,
    type: Number,
    minimum: 1,
  })
  public height!: number
}
