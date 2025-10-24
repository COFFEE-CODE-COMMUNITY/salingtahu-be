import { Injectable } from "@nestjs/common"
import { FileHeaders, FileMetadata, FileProperties, FileStorage } from "./file-storage.abstract"
import { Readable } from "stream"
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { Options, Upload } from "@aws-sdk/lib-storage"
import { ConfigService } from "@nestjs/config"
import { Logger } from "../infrastructure/log/logger.abstract"

@Injectable()
export class S3FileStorage extends FileStorage {
  public constructor(
    private readonly s3Client: S3Client,
    private readonly config: ConfigService,
    private readonly logger: Logger,
  ) {
    super()
  }

  public getBaseUrl(): string {
    return this.s3Client.config.endpoint?.toString() || "https://s3.amazonaws.com"
  }

  public initiateMultipartUpload(filePath: string, headers?: FileHeaders, metadata?: FileMetadata): Promise<void> {
    throw new Error("Method not implemented.")
  }

  public uploadFilePart(
    filePath: string,
    partNumber: number,
    fileStream: Readable,
    abortController?: AbortController,
  ): Promise<void> {
    throw new Error("Method not implemented.")
  }

  public completeMultipartUpload(filePath: string): Promise<boolean> {
    throw new Error("Method not implemented.")
  }

  public abortMultipartUpload(filePath: string): Promise<boolean> {
    throw new Error("Method not implemented.")
  }

  public async uploadFile(
    filePath: string,
    fileStream: Readable,
    headers?: FileHeaders,
    metadata?: FileMetadata,
    abortController?: AbortController,
  ): Promise<void> {
    const uploadOptions: Options = {
      client: this.s3Client,
      params: {
        Bucket: this.config.get<string>("S3_BUCKET_NAME"),
        Key: filePath,
        Body: fileStream,
        Metadata: metadata,
        ContentType: headers?.contentType,
        ContentEncoding: headers?.contentEncoding,
        CacheControl: headers?.cacheControl,
        ContentDisposition: headers?.contentDisposition,
        ContentLanguage: headers?.contentLanguage,
      },
      queueSize: 4,
      partSize: 5 * 1024 * 1024,
      leavePartsOnError: false,
    }

    if (abortController) {
      uploadOptions.abortController = abortController
    }

    const upload = new Upload(uploadOptions)
    await upload.done()
  }

  public async getFile(filePath: string): Promise<Readable | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.config.get<string>("S3_BUCKET_NAME"),
        Key: filePath,
      })

      const response = await this.s3Client.send(command)

      if (!response.Body) {
        return null
      }

      return response.Body as Readable
    } catch (error) {
      this.logger.error(`Error getting file from S3: ${filePath}`, error as Error)
      return null
    }
  }

  public async getFileProperties(filePath: string): Promise<FileProperties | null> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.config.get<string>("S3_BUCKET_NAME"),
        Key: filePath,
      })

      const response = await this.s3Client.send(command)

      // I don't know what's wrong with this error, so I'm ignoring it for now.
      // @ts-ignore
      return {
        contentType: response.ContentType,
        contentEncoding: response.ContentEncoding,
        contentLanguage: response.ContentLanguage,
        contentDisposition: response.ContentDisposition,
        size: response.ContentLength,
        lastModifiedAt: response.LastModified,
        metadata: response.Metadata,
      }
    } catch (error) {
      this.logger.error(`Error getting file properties from S3: ${filePath}`, error as Error)
      return null
    }
  }

  public async moveFile(sourcePath: string, destinationPath: string, headers?: FileHeaders): Promise<void> {
    const bucketName = this.config.get<string>("S3_BUCKET_NAME")
    const copyCommand = new CopyObjectCommand({
      Bucket: bucketName,
      CopySource: `${bucketName}/${sourcePath}`,
      Key: destinationPath,
      MetadataDirective: headers ? "REPLACE" : "COPY",
      CacheControl: headers?.cacheControl,
      ContentDisposition: headers?.contentDisposition,
      ContentEncoding: headers?.contentEncoding,
      ContentLanguage: headers?.contentLanguage,
      ContentType: headers?.contentType,
    })
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: sourcePath,
    })

    try {
      await this.s3Client.send(copyCommand)
      await this.s3Client.send(deleteCommand)
    } catch (error) {
      this.logger.error("Error moving file in S3", error as Error)

      throw error
    }
  }

  public async deleteFile(filePath: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.config.get<string>("S3_BUCKET_NAME"),
        Key: filePath,
      })

      await this.s3Client.send(command)
      return true
    } catch (error) {
      this.logger.error(`Error deleting file from S3: ${filePath}`, error as Error)
      return false
    }
  }
}
