import { Command } from "@nestjs/cqrs"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"
import { Readable } from "stream"

export class UpdateProfilePictureCommand extends Command<CommonResponseDto> {
  public constructor(
    public readonly userId: string,
    public readonly fileStream: Readable,
  ) {
    super()
  }
}
