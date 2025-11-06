import { Injectable } from "@nestjs/common"
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs"
import { Mapper, MappingProfile } from "@automapper/core"
import { User } from "../entities/user.entity"
import { UserPublicDto } from "../dto/user-public.dto"
import { UserDto } from "../dto/user.dto"
import { createMap } from "../../../mappers/create-map.function"

@Injectable()
export class UserMapper extends AutomapperProfile {
  public constructor(@InjectMapper() mapper: Mapper) {
    super(mapper)
  }

  public override get profile(): MappingProfile {
    return (mapper: Mapper): void => {
      createMap(mapper, User, UserPublicDto)
      createMap(mapper, User, UserDto)
    }
  }
}
