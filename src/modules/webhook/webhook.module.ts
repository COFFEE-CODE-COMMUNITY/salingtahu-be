import { Module } from "@nestjs/common"
import { UserModule } from "../user/user.module"
import { WebhookController } from "./controllers/webhook.controller"

@Module({
  imports: [UserModule],
  controllers: [WebhookController],
})
export class WebhookModule {}
