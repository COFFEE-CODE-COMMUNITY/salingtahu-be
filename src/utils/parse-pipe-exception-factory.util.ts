import { plainToInstance } from "class-transformer"
import { CommonResponseDto } from "../dto/common-response.dto"
import { BadRequestException } from "@nestjs/common"

export function parsePipeExceptionFactory(message: string): CommonResponseDto {
  return new BadRequestException(
    plainToInstance(CommonResponseDto, {
      message
    })
  )
}
