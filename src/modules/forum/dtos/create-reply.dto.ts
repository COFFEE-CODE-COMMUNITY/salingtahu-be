import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateReplyDto {
  @ApiProperty({
    description: "Thread id for reply",
    example: "fk93hfns=lfo3r8fasdf",
    type: String,
    required: true,
  })
  @IsNotEmpty({ message: "threadId should not empty" })
  public threadId!: string

  @ApiProperty({
    description: "Thread id for reply",
    example: "fk93hfns=lfo3r8fasdf",
    type: String,
  })
  @IsOptional()
  public parentReplyId?: string | null

  @ApiProperty({
    description: "Content body for reply",
    example: "I dont know how to use javascript for the first time...",
    minLength: 1,
    type: String,
    required: true,
  })
  @IsString({ message: "content harus berupa teks" })
  @IsNotEmpty({ message: "content should not empty" })
  public content!: string
}
