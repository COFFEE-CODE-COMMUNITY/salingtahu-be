import { ICommandHandler, CommandHandler } from "@nestjs/cqrs"
import { ProcessVeriffDecisionCommand } from "../process-veriff-decision.command"
import { VeriffService } from "../../../../services/veriff.service"

@CommandHandler(ProcessVeriffDecisionCommand)
export class ProcessVeriffDecisionHandler implements ICommandHandler<ProcessVeriffDecisionCommand> {
  public constructor(private readonly veriffService: VeriffService) {}

  public async execute(command: ProcessVeriffDecisionCommand): Promise<void> {
    await this.veriffService.verifyDecisionWebHook(command.payload, command.headers)
  }
}
