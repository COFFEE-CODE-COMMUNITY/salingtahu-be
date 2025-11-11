import { ApiProperty } from "@nestjs/swagger"
import { ReadOnly } from "../../../mappers/readonly.decorator"
import { IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator"
import { ValidateOnPost } from "../../../validators/validate-on-post.decorator"
import { AutoMap } from "@automapper/classes"

export class CourseSectionDto {
  @ApiProperty({
    description: "Unique identifier for the course section",
    example: "123e4567-e89b-12d3-a456-426614174000",
    type: String,
    readOnly: true
  })
  @ReadOnly()
  @AutoMap()
  public id!: string

  @ApiProperty({
    description: "Title of the course section",
    example: "Getting Started with JavaScript",
    type: String,
    minLength: 1,
    maxLength: 200
  })
  @MaxLength(200, { message: "Title must be at most 200 characters long" })
  @MinLength(1, { message: "Title must be at least 1 character long" })
  @IsNotEmpty({ message: "Title should not be empty" })
  @IsString({ message: "Title must be a string" })
  @ValidateOnPost()
  @AutoMap()
  public title!: string

  @ApiProperty({
    description: "Display order position of the section within the course",
    example: 1,
    type: Number,
    minimum: 1
  })
  @Min(1, { message: "Display order must be at least 1" })
  @IsNumber({}, { message: "Display order must be a number" })
  @ValidateOnPost()
  @AutoMap()
  public displayOrder!: number

  @ApiProperty({
    description: "Timestamp when the section was created",
    example: "2025-01-15T10:30:00.000Z",
    type: Date,
    readOnly: true
  })
  @ReadOnly()
  @AutoMap()
  public createdAt!: Date

  @ApiProperty({
    description: "Timestamp when the section was last updated",
    example: "2025-11-09T14:20:00.000Z",
    type: Date,
    readOnly: true
  })
  @ReadOnly()
  @AutoMap()
  public updatedAt!: Date
}
