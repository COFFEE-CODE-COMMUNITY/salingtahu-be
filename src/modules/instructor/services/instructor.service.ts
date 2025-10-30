import { Injectable } from "@nestjs/common"
import { DecisionWebhook } from "../../../types/veriff"

@Injectable()
export class InstructorService {
  public async processInstructorVerification(payload: DecisionWebhook.Payload) {}
}
