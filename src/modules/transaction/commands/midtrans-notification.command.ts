import { Command } from "@nestjs/cqrs"

export class MidtransNotificationCommand extends Command<any> {
  public constructor(public readonly payload: any) {
    super()
  }
}
