import { Body, Controller, Post } from "@nestjs/common"

@Controller("webhook")
export class WebhookController {
  public constructor() {}

  @Post("veriff/decision")
  public async handleVeriffDecision(@Body() body: any): Promise<void> {
    // TODO: Implement the logic to handle the Veriff decision webhook
  }
}
