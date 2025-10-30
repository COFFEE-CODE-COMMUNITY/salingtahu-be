import { Body, Controller, Post } from "@nestjs/common"
import { UserService } from "../../user/services/user.service"
import { DecisionWebhook } from "../../../types/veriff"
import { RequiredHeader } from "../../../common/http/required-header.decorator"

@Controller("webhook")
export class WebhookController {
  public constructor(private readonly userService: UserService) {}

  @Post("veriff/decision")
  public async handleVeriffDecision(
    @Body() body: DecisionWebhook.Payload,
    @RequiredHeader("X-Auth-Client") authClient: string,
    @RequiredHeader("X-Hmac-Signature") hmacSignature: string,
    @RequiredHeader("Vrf-Integration-Id") integrationId: string,
  ): Promise<void> {
    await this.userService.verifyInstructor(body, {
      authClient,
      hmacSignature,
      integrationId,
    })
  }
}
