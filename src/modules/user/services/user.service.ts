import { Injectable, PayloadTooLargeException, UnsupportedMediaTypeException } from "@nestjs/common"
import { InjectQueue } from "@nestjs/bullmq"
import { Queue } from "bullmq"
import { Readable } from "stream"
import { FileStorage } from "../../../storage/file-storage.abstract"
import {
  SizeLimitingValidator,
  StreamValidation,
  FileTypeValidator,
  StreamValidationException,
} from "../../../common/io/stream-validation"
import { ProfilePicturePath } from "../helpers/path.helper"
import { plainToInstance } from "class-transformer"
import { CommonResponseDto } from "../../../common/dto/common-response.dto"
import {
  IMAGE_PROCESSING_QUEUE,
  ImageProcessingData,
  ImageProcessingType,
} from "../../../queue/image-processing.consumer"
import { ALLOWED_IMAGE_MIMETYPES } from "../../../constants/mimetype.constant"

@Injectable()
export class UserService {
  private readonly MAX_PICTURE_SIZE = 5 * 1024 * 1024 // 5MB

  public constructor(
    @InjectQueue(IMAGE_PROCESSING_QUEUE) private readonly profilePictureQueue: Queue<ImageProcessingData>,
    private readonly fileStorage: FileStorage,
  ) {}

  public async saveProfilePicture(userId: string, pictureStream: Readable): Promise<void> {
    const abortController = new AbortController()
    const sizeValidator = new SizeLimitingValidator(this.MAX_PICTURE_SIZE)
    const fileTypeValidator = new FileTypeValidator(ALLOWED_IMAGE_MIMETYPES as unknown as string[])
    const streamValidation = new StreamValidation(sizeValidator, fileTypeValidator)

    try {
      pictureStream.pipe(streamValidation)

      const filePath = new ProfilePicturePath({
        userId,
        resolution: "original",
        extension: "bin",
      })
      await this.fileStorage.uploadFile(
        filePath.toString(),
        streamValidation,
        {
          contentType: "application/octet-stream",
        },
        undefined,
        abortController,
      )

      await this.profilePictureQueue.add(ImageProcessingType.PROFILE_PICTURE, { path: filePath.toString() })
    } catch (error) {
      abortController.abort()

      if (error instanceof StreamValidationException) {
        if (error.getValidator() instanceof SizeLimitingValidator) {
          throw new PayloadTooLargeException(
            plainToInstance(CommonResponseDto, {
              message: `Profile picture exceeds the maximum allowed size of ${this.MAX_PICTURE_SIZE / (1024 * 1024)}MB.`,
            }),
          )
        } else if (error.getValidator() instanceof FileTypeValidator) {
          throw new UnsupportedMediaTypeException(
            plainToInstance(CommonResponseDto, {
              message: `Unsupported file type. Allowed types are: ${ALLOWED_IMAGE_MIMETYPES.join(", ")}.`,
            }),
          )
        }
      }

      throw error
    }
  }
}
