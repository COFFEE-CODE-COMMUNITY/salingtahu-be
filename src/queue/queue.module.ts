import { BullModule } from "@nestjs/bullmq"
import { Module } from "@nestjs/common"
import { IMAGE_PROCESSING_QUEUE, ImageProcessingConsumer } from "./image-processing.consumer"
import { UserModule } from "../modules/user/user.module"

@Module({
  imports: [
    BullModule.registerQueue({
      name: IMAGE_PROCESSING_QUEUE,
    }),
    UserModule,
  ],
  providers: [ImageProcessingConsumer],
})
export class QueueModule {}
