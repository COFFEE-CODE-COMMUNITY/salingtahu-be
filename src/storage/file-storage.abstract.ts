import { Readable } from "stream"

export abstract class FileStorage {
  public abstract getBaseUrl(): string
  public abstract initiateMultipartUpload(
    filePath: string,
    headers?: FileHeaders,
    metadata?: FileMetadata,
  ): Promise<void>
  public abstract uploadFilePart(
    filePath: string,
    partNumber: number,
    fileStream: Readable,
    abortController?: AbortController,
  ): Promise<void>
  public abstract completeMultipartUpload(filePath: string): Promise<boolean>
  public abstract abortMultipartUpload(filePath: string): Promise<boolean>
  public abstract uploadFile(
    filePath: string,
    fileStream: Readable,
    headers?: FileHeaders,
    metadata?: FileMetadata,
    abortController?: AbortController,
  ): Promise<void>
  public abstract getFile(filePath: string): Promise<Readable | null>
  public abstract getFileProperties(filePath: string): Promise<FileProperties | null>
  public abstract moveFile(sourcePath: string, destinationPath: string, headers?: FileHeaders): Promise<void>
  public abstract deleteFile(filePath: string): Promise<boolean>
}

export interface FileHeaders {
  cacheControl?: string
  contentDisposition?: string
  contentEncoding?: string
  contentLanguage?: string
  contentType?: string
}

export type FileMetadata = Record<string, string>

export interface FileProperties {
  contentType?: string
  contentEncoding?: string
  contentLanguage?: string
  contentDisposition?: string
  createdAt?: Date
  lastModifiedAt?: Date
  size?: number
  metadata?: FileMetadata
}
