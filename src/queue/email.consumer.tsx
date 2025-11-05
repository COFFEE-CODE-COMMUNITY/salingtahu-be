import { Processor, WorkerHost } from "@nestjs/bullmq"
import { Job } from "bullmq"
import { render } from "@react-email/render"
import { Logger } from "../log/logger.abstract"
import { Resend } from "resend"
import { ConfigService } from "@nestjs/config"

export const EMAIL_QUEUE = "email"

export interface EmailConsumerData {
  to: string
  subject: string
  payload: Record<string, any>
}

@Processor(EMAIL_QUEUE)
export class EmailConsumer extends WorkerHost {
  public constructor(
    private readonly logger: Logger,
    private readonly resend: Resend,
    private readonly config: ConfigService
  ) {
    super()
  }

  public async process(job: Job<EmailConsumerData>): Promise<void> {
    const html = await this.getHtmlTemplate(job.name, job.data.payload)

    await this.resend.emails.send({
      from: this.config.getOrThrow<string>("email.from"),
      to: job.data.to,
      subject: job.data.subject,
      html
    })
  }

  private async getHtmlTemplate(template: string, data: any): Promise<string> {
    const Template = await import(`../email/templates/${template}.template.tsx`).then(m => m.default).catch(null)

    if (!Template) {
      this.logger.error(`Template not found: ${template}`)

      throw new Error(`Template not found: ${template}`)
    }

    return render(<Template {...data} />)
  }
}
