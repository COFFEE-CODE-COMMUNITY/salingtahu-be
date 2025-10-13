import { ApiProperty } from "@nestjs/swagger"

export class InstructorApplicationResponseDto {
  @ApiProperty({
    description: "Status of the instructor application",
    example: true,
  })
  public success!: boolean

  @ApiProperty({
    description: "Response message",
    example: "Your instructor application has been submitted successfully. We will review it shortly.",
  })
  public message!: string
}
