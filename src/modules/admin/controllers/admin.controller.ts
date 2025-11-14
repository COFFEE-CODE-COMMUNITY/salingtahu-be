import { Body, Controller, Patch, Get, Param } from "@nestjs/common"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { ApiTags } from "@nestjs/swagger"
import { UpdateCourseStatusCommand } from "../command/update-course-status.command"
import { Admin } from "../../../validators/admin.decorator"
import { UpdateCourseStatusRequestDto } from "../dtos/update-course-status-request.dto"
import { GetByStatusQuery } from "../queries/get-by-status.query"

@ApiTags("Admin")
@Controller("admin")
export class AdminController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Patch(":courseIdOrSlug")
  @Admin()
  public async updateCourseStatus(
    @Body() dto: UpdateCourseStatusRequestDto,
    @Param("courseIdOrSlug") courseIdOrSlug: string
  ): Promise<void> {
    return await this.commandBus.execute(new UpdateCourseStatusCommand(courseIdOrSlug, dto))
  }

  @Get("")
  @Admin()
  public async getByStatus(): Promise<any> {
    return await this.queryBus.execute(new GetByStatusQuery())
  }
}
