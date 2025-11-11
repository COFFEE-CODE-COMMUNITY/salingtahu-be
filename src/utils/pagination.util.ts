import { BadRequestException } from "@nestjs/common"
import { DataSource, FindManyOptions } from "typeorm"
import { HttpRequestContext } from "../http/http-request-context"
import { PaginationDto, PaginationLinksDto, PaginationMetaDto } from "../dto/pagination.dto"
import { BaseEntity } from "../base/base.entity"
import { Mapper } from "@automapper/core"
import { plainToInstance } from "class-transformer"
import { CommonResponseDto } from "../dto/common-response.dto"

export class Pagination<Entity extends BaseEntity, Dto> {
  private readonly MAX_LIMIT = 100

  public constructor(
    private readonly mapper: Mapper,
    private readonly dataSource: DataSource,
    private readonly httpRequestContext: HttpRequestContext,
    private readonly entity: new () => Entity,
    private readonly dto: new () => Dto
  ) {}

  public async paginate(offset: number, limit: number, options: FindManyOptions<Entity>): Promise<PaginationDto<Dto>> {
    if (limit > this.MAX_LIMIT) {
      throw new BadRequestException(
        plainToInstance(CommonResponseDto, {
          message: `Limit cannot exceed ${this.MAX_LIMIT}`
        })
      )
    }

    const path = this.httpRequestContext.get()!.path
    const repository = this.dataSource.getRepository(this.entity)
    const [data, total] = await repository.findAndCount({
      ...options,
      skip: offset,
      take: limit
    })

    const meta = new PaginationMetaDto()
    meta.totalItems = total
    meta.limit = limit
    meta.offset = offset
    meta.totalPages = Math.ceil(total / limit)

    const links = new PaginationLinksDto()
    links.first = `${path}?limit=${limit}&offset=0`
    links.last = `${path}?limit=${limit}&offset=${(meta.totalPages - 1) * limit}`
    links.previous = offset - limit >= 0 ? `${path}?limit=${limit}&offset=${offset - limit}` : null
    links.next = offset + limit < total ? `${path}?limit=${limit}&offset=${offset + limit}` : null

    const paginationDto = new PaginationDto<Dto>()
    paginationDto.data = this.mapper.mapArray(data, this.entity, this.dto)
    paginationDto.meta = meta
    paginationDto.links = links

    return paginationDto
  }
}
