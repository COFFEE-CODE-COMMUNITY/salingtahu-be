import { Injectable } from "@nestjs/common"
import { TextHasher } from "./text-hasher"
import { createHash } from "crypto"

@Injectable()
export class Sha256TextHasher extends TextHasher {
  public hash(plainText: string): string {
    return createHash("sha256").update(plainText).digest("hex")
  }

  public compare(plainText: string, hashedText: string): boolean {
    const hashedPlainText = this.hash(plainText)
    return hashedPlainText === hashedText
  }
}
