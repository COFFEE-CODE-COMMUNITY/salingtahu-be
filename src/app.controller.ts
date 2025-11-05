import { Controller, Get, StreamableFile, Param, NotFoundException } from "@nestjs/common"
import { FileStorage } from "./storage/file-storage.abstract"
import { plainToInstance } from "class-transformer"
import { CommonResponseDto } from "./dto/common-response.dto"

@Controller()
export class AppController {
  public constructor(private readonly fileStorage: FileStorage) {}

  @Get("/files/*path")
  public async getFile(@Param("path") path: string): Promise<StreamableFile> {
    const filePath = path.split(",").join("/")
    const fileProperties = await this.fileStorage.getFileProperties(filePath)
    const file = await this.fileStorage.getFile(filePath)

    if (!file || !fileProperties) {
      throw new NotFoundException(
        plainToInstance(CommonResponseDto, {
          message: "File not found."
        })
      )
    }

    return new StreamableFile(file, {
      type: fileProperties.contentType || "application/octet-stream"
    })
  }
}
