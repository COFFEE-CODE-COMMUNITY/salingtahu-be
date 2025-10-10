import { IEventHandler } from "@nestjs/cqrs"
import { UserLoggedInEvent } from "../user-logged-in.event"
import { UserRepository } from "../../../user/repositories/user.repository"
import { Logger } from "../../../../infrastructure/log/logger.abstract"

export class UserLoggedInHandler implements IEventHandler<UserLoggedInEvent> {
  public constructor(
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
  ) {}

  public async handle(event: UserLoggedInEvent): Promise<void> {
    const user = event.user

    try {
      user.updateLastLoggedIn()

      await this.userRepository.update(user.id, user)
    } catch (error) {
      this.logger.error("Failed to update last logged in timestamps", error)
    }
  }
}
