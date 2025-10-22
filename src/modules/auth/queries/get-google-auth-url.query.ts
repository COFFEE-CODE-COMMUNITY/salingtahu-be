import { Query } from "@nestjs/cqrs"
import { GoogleAuthResponseDto } from "../dtos/google-auth-response.dto"

export class GetGoogleAuthUrlQuery extends Query<GoogleAuthResponseDto> {
  public constructor(public readonly platform: "web") {
    super()
  }
}
