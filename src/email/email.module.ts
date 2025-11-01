import { Global, Module } from "@nestjs/common"
import { EmailService } from "./email.service"
import { Resend } from "resend"
import { ConfigService } from "@nestjs/config"
import { BullModule } from "@nestjs/bullmq"
import { EMAIL_QUEUE } from "../queue/email.consumer"

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: EMAIL_QUEUE
    })
  ],
  providers: [
    EmailService,
    {
      provide: Resend,
      useFactory(config: ConfigService): Resend {
        return new Resend(config.getOrThrow<string>("RESEND_API_KEY"))
      },
      inject: [ConfigService]
    }
  ],
  exports: [EmailService, Resend]
})
export class EmailModule {}
