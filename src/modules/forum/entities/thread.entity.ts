import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { BaseEntity } from "../../../common/base/base.entity"
import { User } from "../../user/entities/user.entity"
import { Reply } from "./reply.entity"

@Entity("threads")
export class Thread extends BaseEntity {
  @Column({ type: "uuid", name: "user_id", nullable: false })
  public userId!: string

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  @JoinColumn({ name: "user_id" })
  public user?: User | null

  @Column("text")
  public title!: string

  @Column("text")
  public content!: string

  @Column({ type: "text", nullable: true })
  public category!: string | null

  @Column({ name: "replies_count", type: "int", default: 0 })
  public repliesCount!: number

  @OneToMany(() => Reply, reply => reply.thread)
  public replies!: Reply[]
}
