import { Command } from "@nestjs/cqrs"
import { Readable } from "stream"

export class UploadThumbnailCommand extends Command<any> {
  public constructor(
    public readonly lectureId: string,
    public readonly fileStream: Readable
  ) {
    super()
  }
}
