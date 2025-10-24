import { Injectable } from "@nestjs/common"
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs"
import { createMap, forMember, mapFrom, Mapper } from "@automapper/core"
import { CreateThreadDto } from "../dtos/threads/create-thread.dto"
import { Thread } from "../entities/thread.entity"
import { CreateReplyDto } from "../dtos/replies/create-reply.dto"
import { Reply } from "../entities/reply.entity"
import { ThreadResponseDto } from "../dtos/threads/thread-response.dto"
import { UserForumDto } from "../dtos/user-forum.dto"
import { ReplyResponseDto } from "../dtos/replies/reply-response.dto"

@Injectable()
export class ForumMapper extends AutomapperProfile {
  public constructor(@InjectMapper() mapper: Mapper) {
    super(mapper)
  }

  public override get profile() {
    return (mapper: Mapper): void => {
      createMap(mapper, CreateThreadDto, Thread)
      createMap(
        mapper,
        Thread,
        ThreadResponseDto,
        forMember(
          dest => dest.user,
          mapFrom(src => src.user as unknown as UserForumDto),
        ),
      )

      createMap(mapper, CreateReplyDto, Reply)
      createMap(
        mapper,
        Reply,
        ReplyResponseDto,
        forMember(
          dest => dest.user,
          mapFrom(src => src.user as unknown as UserForumDto),
        ),
      )
    }
  }
}
