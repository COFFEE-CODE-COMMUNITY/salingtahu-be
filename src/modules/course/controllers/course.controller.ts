import { Body, Controller, Post } from "@nestjs/common"
import { CourseDto } from "../dto/course.dto"
import { CommandBus } from "@nestjs/cqrs"
import { CreateCourseCommand } from "../commands/create-course.command"
import { Roles } from "../../../guards/roles.guard"
import { UserRole } from "../../user/enums/user-role.enum"
import { Authorized } from "../../../guards/bearer-token.guard"

@Controller("courses")
export class CourseController {
  public constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @Roles([UserRole.INSTRUCTOR])
  @Authorized()
  public async createCourse(@Body() dto: CourseDto): Promise<CourseDto> {
    return this.commandBus.execute(new CreateCourseCommand(dto))
  }
}
