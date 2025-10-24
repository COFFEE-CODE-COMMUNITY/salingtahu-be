import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { CqrsModule } from "@nestjs/cqrs"
import { HttpModule } from "@nestjs/axios"
import { UserModule } from "../user/user.module"
import { JwtModule } from "@nestjs/jwt"
import { CreateThreadHandler } from "./commands/handler/create-thread.handler"
import { CreateReplyHandler } from "./commands/handler/create-reply.handler"
import { UpdateThreadHandler } from "./commands/handler/update-thread.handler"
import { UpdateReplyHandler } from "./commands/handler/update-reply.handler"
import { DeleteThreadHandler } from "./commands/handler/delete-thread.handler"
import { DeleteReplyHandler } from "./commands/handler/delete-reply.handler"
import { GetAllThreadHandler } from "./commands/handler/get-all-thread.handler"
import { ReplyService } from "./services/reply.service"
import { ThreadService } from "./services/thread.service"
import { ThreadRepository } from "./repositories/thread.repository"
import { UserForumRepository } from "./repositories/user-forum.repository"
import { ReplyRepository } from "./repositories/reply.repository"
import { ForumController } from "./controllers/forum.controller"
import { GetAllThreadByKeyHandler } from "./commands/handler/get-all-thread-by-key.handler"
import { GetAllThreadByUserIdHandler } from "./commands/handler/get-all-thread-by-user-id.handler"
import { GetAllReplyHandler } from "./commands/handler/get-all-reply.handler"
import { GetAllChildrenReplyHandler } from "./commands/handler/get-all-children-reply.handler"

@Module({
  imports: [
    ConfigModule,
    CqrsModule,
    HttpModule.register({
      timeout: 10_000,
      maxRedirects: 5,
    }),
    UserModule,
    JwtModule.register({}),
  ],
  controllers: [ForumController],
  providers: [
    CreateThreadHandler,
    CreateReplyHandler,
    UpdateThreadHandler,
    UpdateReplyHandler,
    DeleteThreadHandler,
    DeleteReplyHandler,
    GetAllThreadHandler,
    GetAllThreadByKeyHandler,
    GetAllThreadByUserIdHandler,
    GetAllReplyHandler,
    GetAllChildrenReplyHandler,

    ThreadService,
    ReplyService,

    UserForumRepository,
    ThreadRepository,
    ReplyRepository,
  ],
})
export class ForumModule {}
