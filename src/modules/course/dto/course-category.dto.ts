import { ApiProperty } from "@nestjs/swagger"
import { ReadOnly } from "../../../mappers/readonly.decorator"
import { AutoMap } from "@automapper/classes"
import { IsString, MaxLength } from "class-validator"

export class CourseCategoryDto {
  @ApiProperty({
    readOnly: true
  })
  @ReadOnly()
  @AutoMap()
  public id!: string

  @ApiProperty()
  @MaxLength(100, { message: "Name must be at most 100 characters long" })
  @IsString({ message: "Name must be a string" })
  @AutoMap()
  public name!: string

  @ApiProperty({
    readOnly: true
  })
  @ReadOnly()
  @AutoMap()
  public createdAt!: Date

  @ApiProperty({
    readOnly: true
  })
  @ReadOnly()
  @AutoMap()
  public updatedAt!: Date
}
