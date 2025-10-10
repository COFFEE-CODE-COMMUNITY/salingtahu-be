import { Injectable, BeforeApplicationShutdown, Inject } from "@nestjs/common"
import { Redis, RedisOptions } from "ioredis"
import { REDIS_OPTIONS } from "./redis.constant"

@Injectable()
export class RedisService extends Redis implements BeforeApplicationShutdown {
  public constructor(@Inject(REDIS_OPTIONS) options: RedisOptions) {
    super(options)
  }

  public async beforeApplicationShutdown(_signal?: string): Promise<void> {
    await this.quit()
  }
}
