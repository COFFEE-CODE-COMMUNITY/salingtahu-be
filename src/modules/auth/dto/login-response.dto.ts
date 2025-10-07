import { ApiProperty } from "@nestjs/swagger"

export class LoginResponseDto {
  @ApiProperty({
    description: "The refresh token issued to the user.",
    example: "04184172301jf8he8yf",
    required: true,
  })
  public refreshToken!: string

  @ApiProperty({
    description: "The access token issued to the user.",
    example: "4gfye8784gfu973gYd...",
    required: true,
  })
  public accessToken!: string
}
