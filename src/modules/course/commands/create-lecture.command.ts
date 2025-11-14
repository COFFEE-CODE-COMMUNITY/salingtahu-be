import { Command } from "@nestjs/cqrs";
import { LectureDto } from "../dto/lecture.dto";

export class CreateLectureCommand extends Command<LectureDto> {
  public constructor(
    public readonly courseIdOrSlug: string,
    public readonly sectionId: string,
    public readonly dto: LectureDto
  ) {
    super()
  }
}
