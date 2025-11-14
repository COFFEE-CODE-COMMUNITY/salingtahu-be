import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateLectureCommand } from "../create-lecture.command";
import { LectureDto } from "../../dto/lecture.dto";
import { CourseSectionRepository } from "../../repositories/course-section.repository";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { NotFoundException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { CommonResponseDto } from "../../../../dto/common-response.dto";
import { Lecture } from "../../entities/lecture.entity";
import { LectureRepository } from "../../repositories/lecture.repository";

@CommandHandler(CreateLectureCommand)
export class CreateLectureHandler implements ICommandHandler<CreateLectureCommand> {
  public constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly courseSectionRepository: CourseSectionRepository,
    private readonly lectureRepository: LectureRepository
  ) {}

  public async execute(command: CreateLectureCommand): Promise<LectureDto> {
    const courseSection = await this.courseSectionRepository.findById(command.sectionId)

    if (!courseSection) {
      throw new NotFoundException(
        plainToInstance(CommonResponseDto, {
          message: "Course section not found."
        })
      )
    }

    const lecture = this.mapper.map(command.dto, LectureDto, Lecture)
    lecture.section = courseSection

    return this.mapper.map(await this.lectureRepository.save(lecture), Lecture, LectureDto)
  }
}
