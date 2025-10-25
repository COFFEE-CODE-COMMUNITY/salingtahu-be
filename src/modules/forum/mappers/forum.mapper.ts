import { Injectable } from "@nestjs/common"
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs"
import { createMap, forMember, mapFrom, Mapper } from "@automapper/core"

import { CreateThreadDto } from "../dtos/threads/create-thread.dto"
import { UpdateThreadDto } from "../dtos/threads/update-thread.dto"
import { Thread } from "../entities/thread.entity"
import { ThreadResponseDto } from "../dtos/threads/thread-response.dto"

import { CreateReplyDto } from "../dtos/replies/create-reply.dto"
import { UpdateReplyDto } from "../dtos/replies/update-reply.dto"
import { Reply } from "../entities/reply.entity"
import { ReplyResponseDto } from "../dtos/replies/reply-response.dto"

import { UserForumDto } from "../dtos/user-forum.dto"

@Injectable()
export class ForumMapper extends AutomapperProfile {
  public constructor(@InjectMapper() mapper: Mapper) {
    super(mapper)
  }

  public override get profile() {
    return (mapper: Mapper): void => {
      // CreateThreadDto -> Thread (for creating new thread)
      createMap(mapper, CreateThreadDto, Thread)

      // UpdateThreadDto -> Thread (for updating existing thread)
      createMap(mapper, UpdateThreadDto, Thread)

      // Thread -> ThreadResponseDto (for response)
      createMap(
        mapper,
        Thread,
        ThreadResponseDto,
        forMember(
          dest => dest.user,
          mapFrom(src => src.user as unknown as UserForumDto),
        ),
        // Optional: jika kamu ingin ikut map repliesCount dan kategori null-safe
        forMember(
          dest => dest.category,
          mapFrom(src => src.category ?? null),
        ),
      )

      // CreateReplyDto -> Reply (for creating new reply)
      createMap(mapper, CreateReplyDto, Reply)

      // UpdateReplyDto -> Reply (for updating reply)
      createMap(mapper, UpdateReplyDto, Reply)

      // Reply -> ReplyResponseDto (for response)
      createMap(
        mapper,
        Reply,
        ReplyResponseDto,
        forMember(
          dest => dest.user,
          mapFrom(src => src.user as unknown as UserForumDto),
        ),
        // Soft delete awareness
        forMember(
          dest => dest.parentReplyId,
          mapFrom(src => src.parentReplyId ?? null),
        ),
      )
    }
  }
}
