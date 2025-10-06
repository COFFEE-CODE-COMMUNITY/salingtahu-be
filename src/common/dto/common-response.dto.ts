import { ApiProperty } from "@nestjs/swagger";

export class CommonResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Operation successful',
    type: String,
  })
  public message!: string
}