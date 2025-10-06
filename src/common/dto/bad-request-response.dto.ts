import { CommonResponseDto } from "./common-response.dto"
import { ApiProperty } from "@nestjs/swagger"

export abstract class BadRequestResponseDto<E> extends CommonResponseDto {
  @ApiProperty({
    description: "An object containing detailed error information.",
    example: { field: ["Field is required."] },
  })
  public abstract errors: E
}