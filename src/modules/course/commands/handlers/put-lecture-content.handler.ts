import { CommandHandler, ICommandHandler } from "@nestjs/cqrs"
import { PutLectureContentCommand } from "../put-lecture-content.command"
import { CommonResponseDto } from "../../../../dto/common-response.dto"
import { LectureRepository } from "../../repositories/lecture.repository"
import { NotFoundException } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { CourseLectureType } from "../../enums/course-lecture-type.enum"
import { LectureArticle } from "../../entities/lecture-article.entity"
import { LectureArticleRepository } from "../../repositories/lecture-article.repository"
import { LectureExternalRepository } from "../../repositories/lecture-external.repository"
import { LectureExternal } from "../../entities/lecture-external.entity"
import { LectureFileRepository } from "../../repositories/lecture-file.repository"
import { FileStorage } from "../../../../storage/file-storage.abstract"
import { fileTypeFromBuffer, FileTypeResult } from "file-type"
import { LectureFile } from "../../entities/lecture-file.entity"
import { Logger } from "../../../../log/logger.abstract"
import { FileTypeValidator, StreamValidation } from "../../../../io/stream-validation"
import { ALLOWED_VIDEO_MIMETYPES } from "../../../../constants/mimetype.constant"
import { LectureVideoTemporaryPath } from "../../helpers/path.helper"
import { LectureVideoRepository } from "../../repositories/lecture-video.repository"
import { LectureVideo } from "../../entities/lecture-video.entity"
import { LectureVideoStatus } from "../../enums/lecture-video-status.enum"
import { InjectQueue } from "@nestjs/bullmq"
import {
  VIDEO_PROCESSING_QUEUE,
  VideoProcessingData,
  VideoProcessingType
} from "../../../../queue/video-processing.consumer"
import { Queue } from "bullmq"

@CommandHandler(PutLectureContentCommand)
export class PutLectureContentHandler implements ICommandHandler<PutLectureContentCommand> {
  public constructor(
    @InjectQueue(VIDEO_PROCESSING_QUEUE)
    private readonly videoProcessingQueue: Queue<VideoProcessingData, VideoProcessingType>,
    private readonly lectureRepository: LectureRepository,
    private readonly lectureArticleRepository: LectureArticleRepository,
    private readonly lectureExternalRepository: LectureExternalRepository,
    private readonly lectureFileRepository: LectureFileRepository,
    private readonly lectureVideoRepository: LectureVideoRepository,
    private readonly fileStorage: FileStorage,
    private readonly logger: Logger
  ) {}

  public async execute(command: PutLectureContentCommand): Promise<CommonResponseDto> {
    const lecture = await this.lectureRepository.findById(command.lectureId)

    if (!lecture) {
      throw new NotFoundException(
        plainToInstance(CommonResponseDto, {
          message: "Lecture not found."
        })
      )
    }

    await new Promise<void>((resolve, reject) => {
      command.content.on("error", err => {
        reject(err)
      })

      switch (lecture.type) {
        case CourseLectureType.ARTICLE: {
          let content = ""

          command.content.on("data", chunk => {
            content += chunk.toString()
          })

          command.content.on("end", async () => {
            const lectureArticle = new LectureArticle()
            lectureArticle.content = content
            lectureArticle.lecture = lecture

            await this.lectureArticleRepository.save(lectureArticle)
            resolve()
          })
          break
        }
        case CourseLectureType.EXTERNAL: {
          let url = ""

          command.content.on("data", chunk => {
            url += chunk.toString()
          })

          command.content.on("end", async () => {
            const lectureExternal = new LectureExternal()
            lectureExternal.url = url
            lectureExternal.lecture = lecture

            await this.lectureExternalRepository.save(lectureExternal)
            resolve()
          })
          break
        }
        case CourseLectureType.FILE: {
          const abortController = new AbortController()
          const mimeTypeResult: PromiseWithResolvers<FileTypeResult | undefined> = Promise.withResolvers()
          let isMimeTypeDetermined = false

          command.content.on("data", async chunk => {
            if (!isMimeTypeDetermined) {
              mimeTypeResult.resolve(await fileTypeFromBuffer(chunk))
              isMimeTypeDetermined = true
            }
          })

          const processFile = async (): Promise<void> => {
            try {
              const mimeType = (await mimeTypeResult.promise) || { mime: "application/octet-stream", ext: "bin" }
              const filePath = `courses/${command.courseId}/lectures/${lecture.id}.${mimeType.ext}`
              await this.fileStorage.uploadFile(filePath, command.content)
              const fileProperties = await this.fileStorage.getFileProperties(filePath)

              if (!fileProperties) {
                throw new Error("Failed to retrieve uploaded file properties.")
              }

              const lectureFile = new LectureFile()
              lectureFile.lecture = lecture
              lectureFile.path = filePath
              lectureFile.size = fileProperties.size || 0
              lectureFile.mimetype = mimeType.mime

              await this.lectureFileRepository.save(lectureFile)
              resolve()
            } catch (error) {
              abortController.abort()

              this.logger.error("Error uploading lecture file content", error)

              reject(error)
            }
          }

          processFile()
          break
        }
        case CourseLectureType.VIDEO: {
          const abortController = new AbortController()
          const fileTypeValidator = new FileTypeValidator(ALLOWED_VIDEO_MIMETYPES as unknown as string[])
          const streamValidation = new StreamValidation(fileTypeValidator)

          const processVideo = async (): Promise<void> => {
            try {
              command.content.pipe(streamValidation)

              const temporaryPath = new LectureVideoTemporaryPath(command.courseId, lecture.id)
              await this.fileStorage.uploadFile(
                temporaryPath.toString(),
                streamValidation,
                {
                  contentType: "application/octet-stream"
                },
                undefined,
                abortController
              )

              this.logger.verbose(`Uploaded lecture video to temporary path: ${temporaryPath.toString()}`)

              let lectureVideo = await this.lectureVideoRepository.findByLectureId(lecture.id)

              if (!lectureVideo) {
                lectureVideo = new LectureVideo()
                lectureVideo.lecture = lecture
              }

              lectureVideo.status = LectureVideoStatus.PROCESSING

              await this.lectureVideoRepository.save(lectureVideo)
              await this.videoProcessingQueue.add(VideoProcessingType.LECTURE_VIDEO, {
                path: temporaryPath.toString()
              })

              resolve()
            } catch (error) {
              this.logger.error("Error uploading lecture video content", error)

              reject(error)
            }
          }

          processVideo()
          break
        }
        default: {
          reject(new Error("Unsupported lecture type."))
        }
      }
    })

    return plainToInstance(CommonResponseDto, {
      message: "Lecture content uploaded successfully."
    })
  }
}
