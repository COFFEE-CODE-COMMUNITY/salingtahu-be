import { Global, Module } from "@nestjs/common"
import { VeriffService } from "./veriff.service"

@Global()
@Module({
  providers: [VeriffService],
  exports: [VeriffService]
})
export class ServiceModule {}
