import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from "class-validator"

export class CreateTransactionDto {
  @ApiProperty({
    description: "ID of the user making the transaction",
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: true
  })
  @IsNotEmpty({ message: "User ID is required" })
  @IsUUID("4", { message: "User ID must be a valid UUID" })
  public userId!: string

  @ApiProperty({
    description: "ID of the course being purchased",
    example: "1",
    required: true
  })
  @IsNotEmpty({ message: "Course ID is required" })
  @IsUUID("4", { message: "Course ID must be a valid UUID" })
  public courseId!: string

  @ApiProperty({
    description: "Transaction amount",
    example: 150000,
    required: true
  })
  @IsNotEmpty({ message: "Amount is required" })
  @IsNumber({}, { message: "Amount must be a number" })
  @Min(1, { message: "Amount must be at least 1" })
  public amount!: number

  @ApiProperty({
    description: "Currency code (default: IDR)",
    example: "IDR",
    default: "IDR",
    required: false
  })
  @IsString({ message: "Currency must be a string" })
  public currency: string = "IDR"
}
