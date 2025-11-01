import { Command } from "@nestjs/cqrs"

export class GoogleOAuth2CallbackCommand extends Command<GoogleOAuth2CallbackCommandResponse> {
  public constructor(
    public readonly code: string,
    public readonly state: string,
    public readonly userAgent: string,
    public readonly ipAddress: string
  ) {
    super()
  }
}

export interface GoogleOAuth2CallbackCommandResponse {
  platform: "web"
  refreshToken: string
}
