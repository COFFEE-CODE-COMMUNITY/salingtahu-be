import { Module } from "@nestjs/common"
import { UniqueValidator } from "./unique.decorator"
import { ExistsValidator } from "./exists.decorator"

@Module({
  providers: [ExistsValidator, UniqueValidator],
})
export class ValidationModule {}
