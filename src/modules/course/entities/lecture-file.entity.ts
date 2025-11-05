import { Column, Entity, OneToOne } from "typeorm"
import { BaseEntity } from "../../../base/base.entity"
import { Lecture } from "./lecture.entity"

@Entity()
export class LectureFile extends BaseEntity {
  @OneToOne(() => Lecture, (lecture) => lecture.id, {onDelete: "CASCADE"})
  public lecture!: Lecture

  @Column({ name:"file_path" })
  public filePath!: string

  @Column({ name:"file_name" })
  public fileName!: string

  @Column({ name:"file_size", type: "bigint" })
  public fileSize!: number

  @Column()
  public mimetype!: string
}
