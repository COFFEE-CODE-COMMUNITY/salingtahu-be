import { CourseLectureType } from "../enums/course-lecture-type.enum"

export class LectureDto {
  public title!: string
  public description!: string
  public type!: CourseLectureType
  public displayOrder!: number
}
