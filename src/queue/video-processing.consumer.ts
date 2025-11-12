import { Processor, WorkerHost } from "@nestjs/bullmq"
import { Job } from "bullmq"
import { IllegalArgumentException } from "../exceptions/illegal-argument.exception"
import { Logger } from "../log/logger.abstract"
import { FileStorage } from "../storage/file-storage.abstract"
import { LectureVideoRepository } from "../modules/course/repositories/lecture-video.repository"

export const VIDEO_PROCESSING_QUEUE = "video-processing"

export interface VideoProcessingData {
  lectureId: string
  tempPath: string
}

export enum VideoProcessingType {
  PROCESS_VIDEO = "process-video"
}

@Processor(VIDEO_PROCESSING_QUEUE)
export class VideoProcessingConsumer extends WorkerHost {
  public constructor(
    private readonly lectureVideoRepository: LectureVideoRepository,
    private readonly fileStorage: FileStorage,
    private readonly logger: Logger
  ) {
    super()
  }

  public async process(job: Job<VideoProcessingData, void, VideoProcessingType>): Promise<void> {
    this.logger.verbose(`Processing video job ${job.id} of type ${job.name}`)

    try {
      return this.processVideo(job.data)
    } catch (error) {
      this.logger.error(`Error when processing ${job.name} job.`, error)
    }
  }

  private async processVideo(data: VideoProcessingData): Promise<void> {
    const { lectureId, tempPath } = data

    this.logger.verbose(`Processing video for lecture ${lectureId} from ${tempPath}`)

    // TODO: Implement video processing logic
    // - Move video from temp to final location
    // - Extract video metadata (duration, resolution, etc.)
    // - Generate video thumbnail if needed
    // - Update lecture video entity with metadata

    this.logger.verbose(`Video processing completed for lecture ${lectureId}`)
  }
}
