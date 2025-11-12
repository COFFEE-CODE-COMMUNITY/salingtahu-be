import { Command } from "@nestjs/cqrs"
import { Readable } from "stream"
import { CommonResponseDto } from "../../../dto/common-response.dto"

export class UploadThumbnailCommand extends Command<CommonResponseDto | undefined> {
  public constructor(
    public readonly lectureId: string,
    public readonly fileStream: Readable
  ) {
    super()
  }
}
