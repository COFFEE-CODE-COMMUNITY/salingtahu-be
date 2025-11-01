import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import * as argon2 from "argon2"

@Injectable()
export class PasswordService {
  public constructor(private readonly config: ConfigService) {}

  public async hash(password: string): Promise<string> {
    const argon2Type = this.config.get<string>("password.argon2.type", "argon2id").toLowerCase()
    let algorithmType: 0 | 1 | 2

    switch (argon2Type) {
      case "argon2d":
        algorithmType = 0
        break
      case "argon2i":
        algorithmType = 1
        break
      case "argon2id":
        algorithmType = 2
        break
      default:
        throw new Error(`Algorithm ${argon2Type} is not supported.`)
    }

    return argon2.hash(password, {
      type: algorithmType,
      memoryCost: this.config.get<number>("password.argon2.memoryCost", 8192),
      timeCost: this.config.get<number>("password.argon2.timeCost", 2),
      parallelism: this.config.get<number>("password.argon2.parallelism", 1)
    })
  }

  public async compare(password: string, hashedPassword: string): Promise<boolean> {
    return argon2.verify(hashedPassword, password)
  }
}
