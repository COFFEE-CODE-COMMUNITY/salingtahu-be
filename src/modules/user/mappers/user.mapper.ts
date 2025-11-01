import { Injectable } from "@nestjs/common"
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs"
import { forMember, mapFrom, Mapper, MappingProfile } from "@automapper/core"
import { User } from "../entities/user.entity"
import { UserPublicDto } from "../dto/user-public.dto"
import { ImageDto } from "../../../dto/image.dto"
import { ConfigService } from "@nestjs/config"
import { UserDto } from "../dto/user.dto"
import { createMap } from "../../../mappers/create-map.function"

@Injectable()
export class UserMapper extends AutomapperProfile {
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
        User,
        UserPublicDto,
        forMember(
          d => d.profilePictures,
          mapFrom(s => this.imageMetadataToImageDto(s as User))
        )
      )
      createMap(
        mapper,
        User,
        UserDto,
        forMember(
          d => d.profilePictures,
          mapFrom(s => this.imageMetadataToImageDto(s as User))
        )
      )
    }
  }

  private imageMetadataToImageDto(source: User): ImageDto[] {
    if (!source.profilePictures || source.profilePictures.length === 0) {
      return []
    }

    return source.profilePictures.map(pic => {
      const image = new ImageDto()
      image.url = `${this.config.getOrThrow("app.cdnUrl")}/${pic.path}`
      image.width = pic.width
      image.height = pic.height

      return image
    })
  }
}
