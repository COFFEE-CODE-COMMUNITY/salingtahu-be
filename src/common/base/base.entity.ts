import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

export type EntityId = string

export class BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id!: EntityId

  @CreateDateColumn({ name: "created_at" })
  public createdAt!: Date

  @UpdateDateColumn({ name: "updated_at" })
  public updatedAt!: Date
}