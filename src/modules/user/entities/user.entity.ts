import { Column, Entity } from "typeorm"
import { BaseEntity } from "../../../common/base/base.entity"

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  public username!: string

  @Column({ unique: true })
  public email!: string

  @Column()
  public password!: string
}