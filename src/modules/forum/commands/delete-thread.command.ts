import { Command } from "@nestjs/cqrs"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"

export class DeleteThreadCommand extends Command<CommonResponseDto> {
  public constructor(
    public readonly userId: string,
    public readonly threadId: string,
  ) {
    super()
  }
}
