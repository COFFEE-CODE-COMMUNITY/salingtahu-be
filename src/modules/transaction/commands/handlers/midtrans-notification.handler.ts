import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { MidtransNotificationCommand } from "../midtrans-notification.command"
import { PaymentStatus } from "../../enums/payment-status.enum"
import { TransactionRepository } from "../../repositories/transaction.repository"

@CommandHandler(MidtransNotificationCommand)
export class MidtransNotificationHandler implements ICommandHandler<MidtransNotificationCommand> {
  public constructor(private readonly transactionRepo: TransactionRepository) {}

  public async execute(command: MidtransNotificationCommand): Promise<any> {
    const payload = command.payload

    const orderId = payload.order_id
    const transactionStatus = payload.transaction_status

    const transaction = await this.transactionRepo.findById(orderId)
    if (!transaction) return

    transaction.status = this.mapStatus(transactionStatus)

    await this.transactionRepo.save(transaction)

    return { success: true }
  }

  private mapStatus(status: string): any {
    switch (status) {
      case "settlement":
        return PaymentStatus.COMPLETED
      case "pending":
        return PaymentStatus.PENDING
      case "expire":
        return PaymentStatus.FAILED
      case "deny":
      case "cancel":
        return PaymentStatus.FAILED
      default:
        return PaymentStatus.PENDING
    }
  }
}
