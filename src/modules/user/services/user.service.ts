import {
  Injectable,
  NotFoundException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
  UnauthorizedException
} from "@nestjs/common"
import { InjectQueue } from "@nestjs/bullmq"
import { Queue } from "bullmq"
import { Readable } from "stream"
import { FileStorage } from "../../../storage/file-storage.abstract"
import {
  SizeLimitingValidator,
  StreamValidation,
  FileTypeValidator,
  StreamValidationException
} from "../../../io/stream-validation"
import { ProfilePicturePath } from "../helpers/path.helper"
import { plainToInstance } from "class-transformer"
import { CommonResponseDto } from "../../../dto/common-response.dto"
import {
  IMAGE_PROCESSING_QUEUE,
  ImageProcessingData,
  ImageProcessingType
} from "../../../queue/image-processing.consumer"
import { ALLOWED_IMAGE_MIMETYPES } from "../../../constants/mimetype.constant"
import { Logger } from "../../../log/logger.abstract"
import { UserRepository } from "../repositories/user.repository"
import { DecisionWebhook } from "../../../types/veriff"
import { DecisionWebhookHeaders, VeriffService } from "../../../services/veriff.service"
import { UserRole } from "../enums/user-role.enum"
import { EmailService } from "../../../email/email.service"
import { ConfigService } from "@nestjs/config"
import { InstructorVerification } from "../entities/instructor-verification.entity"

@Injectable()
export class UserService {
  private readonly MAX_PICTURE_SIZE = 5 * 1024 * 1024 // 5MB

  public constructor(
    @InjectQueue(IMAGE_PROCESSING_QUEUE) private readonly profilePictureQueue: Queue<ImageProcessingData>,
    private readonly userRepository: UserRepository,
    private readonly veriffService: VeriffService,
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
    private readonly fileStorage: FileStorage,
    private readonly logger: Logger
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
        extension: "bin"
      })
      await this.fileStorage.uploadFile(
        filePath.toString(),
        streamValidation,
        {
          contentType: "application/octet-stream"
        },
        undefined,
        abortController
      )

      await this.profilePictureQueue.add(ImageProcessingType.PROFILE_PICTURE, { path: filePath.toString() })
    } catch (error) {
      abortController.abort()

      if (error instanceof StreamValidationException) {
        if (error.getValidator() instanceof SizeLimitingValidator) {
          throw new PayloadTooLargeException(
            plainToInstance(CommonResponseDto, {
              message: `Profile picture exceeds the maximum allowed size of ${this.MAX_PICTURE_SIZE / (1024 * 1024)}MB.`
            })
          )
        } else if (error.getValidator() instanceof FileTypeValidator) {
          throw new UnsupportedMediaTypeException(
            plainToInstance(CommonResponseDto, {
              message: `Unsupported file type. Allowed types are: ${ALLOWED_IMAGE_MIMETYPES.join(", ")}.`
            })
          )
        }
      }

      throw error
    }
  }

  public async verifyInstructor(payload: DecisionWebhook.Payload, headers: DecisionWebhookHeaders): Promise<void> {
    if (!this.veriffService.verifyDecisionWebHook(payload, headers)) {
      this.logger.warn("Invalid HMAC signature in Veriff webhook")

      throw new UnauthorizedException(
        plainToInstance(CommonResponseDto, {
          message: "Invalid HMAC signature"
        })
      )
    }

    const user = await this.userRepository.findById(payload.verification.vendorData || "")

    if (!user) {
      this.logger.warn(`User with id: ${payload.verification.vendorData} not found`)

      throw new NotFoundException(
        plainToInstance(CommonResponseDto, {
          message: "User not found"
        })
      )
    }

    switch (payload.verification.status) {
      case "approved": {
        this.logger.verbose(`Instructor with vendorData: ${headers.integrationId} has been verified successfully.`)

        user.roles.push(UserRole.INSTRUCTOR)

        await this.emailService.send(user.email, "Your instructor application has been verified", {
          name: "instructor-verified",
          payload: {
            firstName: user.firstName,
            dashboardUrl: `${this.config.get<string>("client.web.url")}/dashboard/instructor`
          }
        })

        break
      }
      case "review":
        this.logger.verbose(`Instructor with vendorData: ${headers.integrationId} is under review.`)
        break
      case "abandoned":
      case "declined":
      case "expired":
      case "resubmission_requested":
        this.logger.verbose(
          `Instructor with vendorData: ${headers.integrationId} verification failed with status: ${payload.verification.status}.`
        )

        await this.emailService.send(user.email, "Your instructor application has been declined", {
          name: "instructor-declined",
          payload: {
            firstName: user.firstName,
            dashboardUrl: `${this.config.get<string>("client.web.url")}/dashboard/instructor`
          }
        })

        break
      default:
        this.logger.log(
          `Verification status '${payload.verification.status}' for vendorData: ${payload.verification.vendorData}`
        )
        break
    }

    const instructorVerification = new InstructorVerification()
    instructorVerification.verificationData = payload

    user.instructorVerifications.push(instructorVerification)
    await this.userRepository.update(user)
  }
}
