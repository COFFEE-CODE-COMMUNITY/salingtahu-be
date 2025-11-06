import { AutoMap } from "@automapper/classes"

export class ImageMetadata {
  @AutoMap()
  public path!: string

  @AutoMap()
  public width!: number

  @AutoMap()
  public height!: number
}
