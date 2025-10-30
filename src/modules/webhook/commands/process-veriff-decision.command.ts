import { Command } from "@nestjs/cqrs"
import { DecisionWebhookHeaders } from "../../../services/veriff.service"
import { DecisionWebhook } from "../../../types/veriff"

export class ProcessVeriffDecisionCommand extends Command<void> {
  public constructor(
    public readonly payload: DecisionWebhook.Payload,
    public readonly headers: DecisionWebhookHeaders,
  ) {
    super()
  }
}
