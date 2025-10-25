import { Query } from "@nestjs/cqrs"
import { GetAllThreadByUserIdResponseDto } from "../dtos/threads/get-all-thread-by-user-id-response.dto"

export class GetAllThreadByUserIdQuery extends Query<GetAllThreadByUserIdResponseDto> {
  public constructor(
    public readonly userId: string,
    public readonly page: number,
    public readonly limit: number,
    public readonly category?: string | undefined,
    public readonly sort?: "latest" | "popular",
  ) {
    super()
  }
}
