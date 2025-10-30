import { ApiProperty } from "@nestjs/swagger"

export class VeInstructorResponseDto {
  @ApiProperty({ description: "The session ID of Veriff for the instructor verification." })
  public sessionId!: string

  @ApiProperty({ description: "The Veriff URL for the instructor verification." })
  public url!: string
}
