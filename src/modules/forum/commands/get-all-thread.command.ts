import { Command } from "@nestjs/cqrs"
import { GetAllThreadResponseDto } from "../dtos/threads/get-all-thread-response.dto"

export class GetAllThreadCommand extends Command<GetAllThreadResponseDto> {
  public constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly category?: string,
    public readonly sort?: "latest" | "popular",
  ) {
    super()
  }
}
