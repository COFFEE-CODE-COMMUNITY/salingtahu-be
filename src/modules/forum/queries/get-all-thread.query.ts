import { Query } from "@nestjs/cqrs"
import { GetAllThreadResponseDto } from "../dtos/threads/get-all-thread-response.dto"

export class GetAllThreadQuery extends Query<GetAllThreadResponseDto> {
  public constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly category?: string,
    public readonly sort?: "latest" | "popular",
  ) {
    super()
  }
}
