import { Transform } from "stream"
import { fileTypeFromBuffer } from "file-type"

export class StreamValidation extends Transform {
  private readonly streamValidators: StreamValidator[]

  public constructor(...streamValidators: StreamValidator[]) {
    super()

    this.streamValidators = streamValidators
  }

  public override async _transform(
    chunk: Buffer,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void,
  ): Promise<void> {
    try {
      for (const streamValidator of this.streamValidators) {
        const isValid = await streamValidator.validateChunk(chunk)

        if (!isValid) {
          const error = new StreamValidationException(await streamValidator.message(), streamValidator)
          this.destroy(error)
          callback(error)
          return
        }
      }

      this.push(chunk)
      callback()
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown stream validation error")
      callback(error)
    }
  }
}

export class StreamValidationException extends Error {
  public constructor(
    errorMessage: string,
    private readonly validator: StreamValidator,
  ) {
    super(errorMessage)

    this.name = "StreamValidationException"
    Error.captureStackTrace(this, this.constructor)
  }

  public getValidator(): StreamValidator {
    return this.validator
  }
}

export class SizeLimitingValidator implements StreamValidator {
  private currentSize: number = 0

  public constructor(private readonly maxSize: number) {}

  public validateChunk(chunk: Buffer): boolean {
    this.currentSize += chunk.length

    if (this.currentSize > this.maxSize) {
      return false
    }

    return true
  }

  public message(): string {
    return `Stream size exceed limit ${this.currentSize}`
  }
}

export class FileTypeValidator implements StreamValidator {
  private readonly detectionBuffers: Buffer[] = []
  private completeDetection: boolean = false
  private detectedMimeType: string | null = null

  public constructor(
    private readonly allowedMimetypes: string[],
    private readonly minDetectionSize: number = 4100,
  ) {}

  public async validateChunk(chunk: Buffer): Promise<boolean> {
    if (this.completeDetection) {
      return true
    }

    this.detectionBuffers.push(chunk)

    const totalBytes = this.detectionBuffers.reduce((sum, buf) => sum + buf.length, 0)

    if (totalBytes >= this.minDetectionSize) {
      const buffer = Buffer.concat(this.detectionBuffers)
      const fileType = await fileTypeFromBuffer(buffer)

      this.completeDetection = true
      // Don't clear buffers here - they're already pushed to the stream
      this.detectedMimeType = fileType?.mime || null

      if (!fileType || !this.allowedMimetypes.includes(fileType.mime)) {
        return false
      }

      this.detectionBuffers.length = 0
    }

    return true
  }

  public message(): string {
    if (this.detectedMimeType) {
      return `Unsupported mimetype "${this.detectedMimeType}"`
    }
    return "Unable to detect file type or file type not supported"
  }
}

export interface FileType {
  extension: string
  mimeType: string
}

export interface StreamValidator {
  validateChunk(chunk: Buffer): Promise<boolean> | boolean
  message(): Promise<string> | string
}
