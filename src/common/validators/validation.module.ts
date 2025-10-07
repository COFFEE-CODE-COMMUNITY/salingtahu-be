import { Module } from "@nestjs/common"
import { UniqueValidator } from "./unique.decorator"

@Module({
  providers: [UniqueValidator],
})
export class ValidationModule {}
