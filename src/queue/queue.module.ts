import { Module } from "@nestjs/common"
import { ImageProcessingConsumer } from "./image-processing.consumer"
import { UserModule } from "../modules/user/user.module"
import { EmailConsumer } from "./email.consumer"

@Module({
  imports: [UserModule],
  providers: [EmailConsumer, ImageProcessingConsumer]
})
export class QueueModule {}
