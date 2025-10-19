import { Global, Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { CreateBucketCommand, HeadBucketCommand, S3Client, S3ServiceException } from "@aws-sdk/client-s3"
import { Logger } from "../infrastructure/log/logger.abstract"
import { FileStorage } from "./file-storage.abstract"
import { S3FileStorage } from "./s3-file-storage"

@Global()
@Module({
  providers: [
    {
      provide: S3Client,
      async useFactory(config: ConfigService, logger: Logger): Promise<S3Client> {
        const bucketName = config.getOrThrow("S3_BUCKET_NAME")
        const s3Client = new S3Client({
          region: config.getOrThrow<string>("S3_REGION"),
          endpoint: config.getOrThrow<string>("S3_ENDPOINT"),
          credentials: {
            accessKeyId: config.getOrThrow<string>("S3_ACCESS_KEY"),
            secretAccessKey: config.getOrThrow<string>("S3_SECRET_KEY"),
          },
          forcePathStyle: true,
        })

        try {
          await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }))
        } catch (error) {
          if (error instanceof S3ServiceException) {
            // Handle case where bucket doesn't exist
            if (error.$metadata.httpStatusCode === 404 || error.name === "NotFound") {
              try {
                logger.info(`Bucket ${bucketName} not found. Creating...`)
                await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }))
                logger.info(`Bucket ${bucketName} created successfully`)
              } catch (createError) {
                // Ignore if bucket already exists (race condition or already owned)
                if (
                  createError instanceof S3ServiceException &&
                  (createError.name === "BucketAlreadyOwnedByYou" || createError.name === "BucketAlreadyExists")
                ) {
                  logger.info(`Bucket ${bucketName} already exists`)
                } else {
                  logger.error("Error when creating S3 bucket: ", createError)
                  throw createError
                }
              }
            } else {
              // For other S3 errors, just log and continue (bucket might still be accessible)
              logger.warn(`S3 HeadBucket check failed: ${error.name}`)
            }
          } else {
            logger.error("Error when checking S3 bucket: ", error)
            throw error
          }
        }

        return s3Client
      },
      inject: [ConfigService, Logger],
    },
    {
      provide: FileStorage,
      useClass: S3FileStorage,
    },
  ],
  exports: [FileStorage],
})
export class StorageModule {}
