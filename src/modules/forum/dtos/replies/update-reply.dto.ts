import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class UpdateReplyDto {
  @ApiProperty({
    description: "Updated content of the reply",
    example: "I’ve changed my opinion after reading the documentation again.",
    required: true,
  })
  @IsString({ message: "content must be a string" })
  @IsNotEmpty({ message: "content should not be empty" })
  @MinLength(1, { message: "content must be at least 1 character long" })
  public content!: string
}
