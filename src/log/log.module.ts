import { Global, Module } from "@nestjs/common"
import { Logger } from "./logger.abstract"
import { WinstonLogger } from "./winston.logger"

@Global()
@Module({
  providers: [
    {
      provide: Logger,
      useClass: WinstonLogger
    }
  ],
  exports: [Logger]
})
export class LogModule {}
