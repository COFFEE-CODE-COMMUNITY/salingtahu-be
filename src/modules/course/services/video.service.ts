import { InjectQueue } from "@nestjs/bullmq"
import {
  VIDEO_PROCESSING_QUEUE,
  VideoProcessingData,
  VideoProcessingType
} from "../../../queue/video-processing.consumer"
import { Queue } from "bullmq"
import { Readable } from "stream"
import { FileStorage } from "../../../storage/file-storage.abstract"
import {
  Injectable,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
  BadRequestException
} from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { CommonResponseDto } from "../../../dto/common-response.dto"
import * as fs from "fs/promises"
import * as path from "path"
import { createWriteStream, createReadStream } from "fs"
import { LectureVideoRepository } from "../repositories/lecture-video.repository"
import { LectureVideo, VideoStatus } from "../entities/lecture-video.entity"
import { Lecture } from "../entities/lecture.entity"

@Injectable()
export class VideoService {
  private readonly VIDEO_SIZE_LIMIT = 524288000 // 500MB
  private readonly TEMP_DIR = path.join(process.cwd(), "temp", "videos")

  public constructor(
    @InjectQueue(VIDEO_PROCESSING_QUEUE) private readonly videoQueue: Queue<VideoProcessingData>,
    private readonly fileStorage: FileStorage,
    private readonly lectureVideoRepository: LectureVideoRepository
  ) {}

  /**
   * Upload video chunk
   * @param lectureId - The lecture ID
   * @param chunkStream - The chunk stream
   * @param chunkIndex - Current chunk index (0-based)
   * @param totalChunks - Total number of chunks
   * @param fileName - Original file name
   * @returns Upload status
   */
  public async uploadVideoChunk(
    lectureId: string,
    chunkStream: Readable,
    chunkIndex: number,
    totalChunks: number,
    fileName: string
  ): Promise<{ completed: boolean; message: string }> {
    try {
      // Ensure temp directory exists
      await fs.mkdir(this.TEMP_DIR, { recursive: true })

      const chunkDir = path.join(this.TEMP_DIR, lectureId)
      await fs.mkdir(chunkDir, { recursive: true })

      // Save chunk to disk
      const chunkPath = path.join(chunkDir, `chunk-${chunkIndex}`)
      const writeStream = createWriteStream(chunkPath)

      await new Promise<void>((resolve, reject) => {
        chunkStream.pipe(writeStream)
        writeStream.on("finish", () => {
          resolve()
        })
        writeStream.on("error", reject)
      })

      // Get or create lecture video entity
      let lectureVideo = await this.lectureVideoRepository.findByLectureId(lectureId)

      if (!lectureVideo) {
        lectureVideo = new LectureVideo()
        lectureVideo.lecture = { id: lectureId } as Lecture
        lectureVideo.fileName = fileName
        lectureVideo.totalChunks = totalChunks
        lectureVideo.uploadedChunks = []
        lectureVideo.status = VideoStatus.UPLOADING
      }

      // Update uploaded chunks
      if (!lectureVideo.uploadedChunks.includes(chunkIndex)) {
        lectureVideo.uploadedChunks.push(chunkIndex)
        lectureVideo.uploadedChunks.sort((a, b) => a - b)
      }

      await this.lectureVideoRepository.save(lectureVideo)

      // Check if all chunks are uploaded
      const allChunksUploaded = lectureVideo.uploadedChunks.length === totalChunks

      if (allChunksUploaded) {
        // Merge chunks and process video
        await this.mergeAndProcessVideo(lectureId, fileName, totalChunks, chunkDir)

        return {
          completed: true,
          message: "Video upload completed and processing started"
        }
      }

      return {
        completed: false,
        message: `Chunk ${chunkIndex + 1}/${totalChunks} uploaded successfully`
      }
    } catch (error) {
      // Update status to failed
      const lectureVideo = await this.lectureVideoRepository.findByLectureId(lectureId)
      if (lectureVideo) {
        lectureVideo.status = VideoStatus.FAILED
        lectureVideo.errorMessage = error instanceof Error ? error.message : "Unknown error"
        await this.lectureVideoRepository.save(lectureVideo)
      }

      throw new BadRequestException(
        plainToInstance(CommonResponseDto, {
          message: `Failed to upload video chunk: ${error instanceof Error ? error.message : "Unknown error"}`
        })
      )
    }
  }

  //Merge all chunks and process video
  private async mergeAndProcessVideo(
    lectureId: string,
    fileName: string,
    totalChunks: number,
    chunkDir: string
  ): Promise<void> {
    const mergedFilePath = path.join(chunkDir, fileName)
    const writeStream = createWriteStream(mergedFilePath)

    try {
      // Merge all chunks sequentially
      for (let i = 0; i < totalChunks; i++) {
        const chunkPath = path.join(chunkDir, `chunk-${i}`)
        const readStream = createReadStream(chunkPath)

        await new Promise<void>((resolve, reject) => {
          readStream.pipe(writeStream, { end: false })
          readStream.on("end", () => {
            resolve()
          })
          readStream.on("error", reject)
        })

        // Delete chunk after merging
        await fs.unlink(chunkPath)
      }

      writeStream.end()

      // Get file size and validate
      const stats = await fs.stat(mergedFilePath)
      if (stats.size > this.VIDEO_SIZE_LIMIT) {
        throw new PayloadTooLargeException(
          plainToInstance(CommonResponseDto, {
            message: `Video exceeds the maximum allowed size of ${this.VIDEO_SIZE_LIMIT / (1024 * 1024)}MB.`
          })
        )
      }

      // Validate file type (basic check by extension)
      const ext = path.extname(fileName).toLowerCase()
      const allowedExtensions = [".mp4", ".webm", ".mov"]
      if (!allowedExtensions.includes(ext)) {
        throw new UnsupportedMediaTypeException(
          plainToInstance(CommonResponseDto, {
            message: `Unsupported file type. Allowed types are: ${allowedExtensions.join(", ")}.`
          })
        )
      }

      // Upload to storage
      const storagePath = `lectures/${lectureId}/video${ext}`
      const fileStream = createReadStream(mergedFilePath)
      await this.fileStorage.uploadFile(storagePath, fileStream, {
        contentType: this.getContentType(ext)
      })

      // Update lecture video metadata
      const lectureVideo = await this.lectureVideoRepository.findByLectureId(lectureId)
      if (lectureVideo) {
        lectureVideo.videoUrl = storagePath
        lectureVideo.fileSize = stats.size
        lectureVideo.mimeType = this.getContentType(ext)
        lectureVideo.status = VideoStatus.PROCESSING
        await this.lectureVideoRepository.save(lectureVideo)
      }

      // Add to processing queue
      await this.videoQueue.add(VideoProcessingType.PROCESS_VIDEO, {
        lectureId,
        tempPath: storagePath
      })

      // Clean up temp directory
      await fs.rm(chunkDir, { recursive: true, force: true })
    } catch (error) {
      writeStream.close()
      throw error
    }
  }

  // Get content type based on file extension
  private getContentType(ext: string): string {
    const contentTypes: Record<string, string> = {
      ".mp4": "video/mp4",
      ".webm": "video/webm",
      ".mov": "video/quicktime"
    }
    return contentTypes[ext] || "application/octet-stream"
  }
}
