import { Command } from "@nestjs/cqrs"
import { GetAllThreadByKeyResponseDto } from "../dtos/threads/get-all-thread-by-key-response.dto"

export class GetAllThreadByKeyCommand extends Command<GetAllThreadByKeyResponseDto> {
  public constructor(
    public readonly searchKey: string,
    public readonly page: number,
    public readonly limit: number,
    public readonly category?: string | undefined,
    public readonly sort?: "latest" | "popular",
  ) {
    super()
  }
}
