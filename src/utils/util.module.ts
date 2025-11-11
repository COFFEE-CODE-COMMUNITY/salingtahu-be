import { Global, Module } from "@nestjs/common"
import { ProviderUtil } from "./provider.util"

@Global()
@Module({
  providers: [ProviderUtil],
  exports: [ProviderUtil]
})
export class UtilModule {}
