import { Injectable } from "@nestjs/common"
import { BaseEntity } from "../base/base.entity"
import { InjectMapper } from "@automapper/nestjs"
import { Mapper } from "@automapper/core"
import { DataSource } from "typeorm"
import { HttpRequestContext } from "../http/http-request-context"
import { Pagination } from "../utils/pagination.util"

@Injectable()
export class PaginationFactory {
  public constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private readonly dataSource: DataSource,
    private readonly httpRequestContext: HttpRequestContext
  ) {}

  public create<Entity extends BaseEntity, Dto>(entity: new () => Entity, dto: new () => Dto): Pagination<Entity, Dto> {
    return new Pagination<Entity, Dto>(this.mapper, this.dataSource, this.httpRequestContext, entity, dto)
  }
}
