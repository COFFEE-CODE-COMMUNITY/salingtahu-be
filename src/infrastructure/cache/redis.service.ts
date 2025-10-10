import { Injectable, BeforeApplicationShutdown } from "@nestjs/common"
import { Redis, RedisOptions } from "ioredis"

@Injectable()
export class RedisService extends Redis implements BeforeApplicationShutdown {
  public constructor(options: RedisOptions) {
    super(options)
  }

  public async beforeApplicationShutdown(_signal?: string): Promise<void> {
    await this.quit()
  }
}
