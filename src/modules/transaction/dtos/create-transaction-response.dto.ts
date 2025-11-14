import { ApiProperty } from "@nestjs/swagger"

export class CreateTransactionResponseDto {
  @ApiProperty({
    description: "Transaction ID from our system",
    example: "123e4567-e89b-12d3-a456-426614174000"
  })
  public transactionId!: string

  @ApiProperty({
    description: "Snap token from Midtrans for payment page",
    example: "66e4fa55-fdac-4ef9-91b5-733b97d1b862"
  })
  public snapToken!: string

  @ApiProperty({
    description: "Redirect URL for Midtrans payment page",
    example: "https://app.sandbox.midtrans.com/snap/v2/vtweb/66e4fa55-fdac-4ef9-91b5-733b97d1b862"
  })
  public redirectUrl!: string
}
