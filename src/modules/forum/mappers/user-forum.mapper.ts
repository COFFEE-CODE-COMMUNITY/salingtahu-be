import { Injectable } from "@nestjs/common"
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs"
import { Mapper, createMap, forMember, mapFrom } from "@automapper/core"
import { User } from "../../user/entities/user.entity"
import { UserForumDto } from "../dtos/user-forum.dto"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class UserForumProfile extends AutomapperProfile {
  public constructor(
    @InjectMapper() mapper: Mapper,
    private readonly config: ConfigService,
  ) {
    super(mapper)
  }

  public override get profile() {
    return (mapper: Mapper): void => {
      createMap(
        mapper,
        User,
        UserForumDto,

        forMember(
          dest => dest.firstname,
          mapFrom(src => src.firstName),
        ),

        forMember(
          dest => dest.profilePicture,
          mapFrom(src => {
            if (!Array.isArray(src.profilePictures) || !src.profilePictures.length) return null
            const img = src.profilePictures[0]
            const baseUrl = this.config.get("app.cdnUrl") ?? "https://cdn.salingtau.com"
            return {
              url: `${baseUrl}${img?.path}`,
              width: img?.width,
              height: img?.height,
            }
          }),
        ),
      )
    }
  }
}
