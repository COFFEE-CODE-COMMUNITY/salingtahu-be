import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { AdminRepository } from "../../repositories/admin.repository"

@QueryHandler(GetByStatusHandler)
export class GetByStatusHandler implements IQueryHandler<GetByStatusHandler> {
  public constructor(private readonly adminRepository: AdminRepository) {}

  public async execute(): Promise<any> {
    return await this.adminRepository.findByStatusReview()
  }
}
