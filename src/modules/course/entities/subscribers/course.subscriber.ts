import { EventSubscriber, EntitySubscriberInterface, DataSource, InsertEvent, UpdateEvent } from "typeorm"
import { Course } from "../course.entity"
import { Injectable, NotFoundException } from "@nestjs/common"
import slugify from "@sindresorhus/slugify"
import { nanoid } from "nanoid"
import { UserRepository } from "../../../user/repositories/user.repository"
import { HttpRequestContext } from "../../../../http/http-request-context"
import { plainToInstance } from "class-transformer"
import { CommonResponseDto } from "../../../../dto/common-response.dto"

@Injectable()
@EventSubscriber()
export class CourseSubscriber implements EntitySubscriberInterface<Course> {
  public constructor(
    dataSource: DataSource,
    private readonly userRepository: UserRepository,
    private readonly httpRequestContext: HttpRequestContext
  ) {
    dataSource.subscribers.push(this)
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  public listenTo(): Function {
    return Course
  }

  public async beforeInsert(event: InsertEvent<Course>): Promise<void> {
    // Handle slug insertion
    event.entity.slug = `${slugify(event.entity.title)}-${nanoid(6)}`

    // Handle instructor insertion
    const httpRequest = this.httpRequestContext.get()!
    const instructor = await this.userRepository.findById(httpRequest.userId!)

    if (!instructor) {
      throw new NotFoundException(
        plainToInstance(CommonResponseDto, {
          message: "Instructor not found."
        })
      )
    }

    event.entity.instructor = instructor
  }

  public beforeUpdate(event: UpdateEvent<Course>): Promise<any> | void {
    if (event.entity && event.databaseEntity.title !== event.entity.title) {
      event.entity.slug = `${slugify(event.entity.title)}-${nanoid(6)}`
    }
  }
}
