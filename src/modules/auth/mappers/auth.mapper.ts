import { Injectable } from "@nestjs/common"
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs"
import { createMapper, Mapper } from "@automapper/core"
import { RegisterDto } from "../dto/register.dto"
import { User } from "../../user/entities/user.entity"

@Injectable()
export class AuthMapper extends AutomapperProfile {
  public constructor(@InjectMapper() mapper: Mapper) {
    super(mapper)
  }

  public override get profile() {
    return (mapper: Mapper) => {
      createMapper(mapper, RegisterDto, User)
    }
  }
}