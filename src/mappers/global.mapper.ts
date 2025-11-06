import { forMember, mapFrom, Mapper, MappingProfile } from "@automapper/core"
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { createMap } from "./create-map.function"
import { ImageMetadata } from "../entities/image-metadata.entity"
import { ImageDto } from "../dto/image.dto"

@Injectable()
export class GlobalMapper extends AutomapperProfile {
  public constructor(
    @InjectMapper() mapper: Mapper,
    private readonly config: ConfigService
  ) {
    super(mapper)
  }

  public override get profile(): MappingProfile {
    return (mapper: Mapper): void => {
      createMap(
        mapper,
        ImageMetadata,
        ImageDto,
        forMember(
          d => d.url,
          mapFrom(s => `${this.config.getOrThrow("app.cdnUrl")}/${s.path}`)
        )
      )
    }
  }
}
