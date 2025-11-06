import { AutomapperProfile, InjectMapper } from "@automapper/nestjs"
import { Mapper } from "@automapper/core"
import { Injectable } from "@nestjs/common"
import { createMap } from "../../../mappers/create-map.function"
import { CourseDto } from "../dto/course.dto"
import { Course } from "../entities/course.entity"
import { CourseCategoryDto } from "../dto/course-category.dto"
import { CourseCategory } from "../entities/course-category.entity"

@Injectable()
export class CourseMapper extends AutomapperProfile {
  public constructor(@InjectMapper() mapper: Mapper) {
    super(mapper)
  }

  public get profile() {
    return (mapper: Mapper): void => {
      createMap(mapper, CourseDto, Course)
      createMap(mapper, Course, CourseDto)

      createMap(mapper, CourseCategoryDto, CourseCategory)
      createMap(mapper, CourseCategory, CourseCategoryDto)
    }
  }
}
