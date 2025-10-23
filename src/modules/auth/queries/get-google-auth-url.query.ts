import { Query } from "@nestjs/cqrs"
import { GoogleAuthResponseDto } from "../dto/google-auth-response.dto"
import { OAuth2Platform } from "../services/oauth2-service"

export class GetGoogleAuthUrlQuery extends Query<GoogleAuthResponseDto> {
  public constructor(public readonly platform: OAuth2Platform) {
    super()
  }
}
