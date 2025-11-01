import { Global, Module } from "@nestjs/common"
import { TextHasher } from "./cryptography/text-hasher"
import { Sha256TextHasher } from "./cryptography/sha256-text-hasher"

@Global()
@Module({
  providers: [
    {
      provide: TextHasher,
      useClass: Sha256TextHasher
    }
  ],
  exports: [TextHasher]
})
export class SecurityModule {}
