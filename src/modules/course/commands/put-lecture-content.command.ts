import { Command } from "@nestjs/cqrs"
import { CommonResponseDto } from "../../../dto/common-response.dto"
import { Readable } from "stream"

export class PutLectureContentCommand extends Command<CommonResponseDto> {
  public constructor(
    public readonly courseId: string,
    public readonly lectureId: string,
    public readonly content: Readable
  ) {
    super()
  }
}
