import { Entity, Column, ManyToOne, JoinColumn, DeleteDateColumn, OneToMany } from "typeorm"
import { Thread } from "./thread.entity"
import { User } from "../../user/entities/user.entity"
import { BaseEntity } from "../../../common/base/base.entity"
import { AutoMap } from "@automapper/classes"

@Entity("replies")
export class Reply extends BaseEntity {
  @Column({ type: "uuid", name: "thread_id", nullable: false })
  public threadId!: string

  @ManyToOne(() => Thread, { onDelete: "CASCADE" })
  @JoinColumn({ name: "thread_id" })
  @AutoMap()
  public thread!: Thread

  @Column({ type: "uuid", name: "user_id", nullable: false })
  public userId!: string

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  @JoinColumn({ name: "user_id" })
  @AutoMap()
  public user?: User | null

  @Column("text")
  @AutoMap()
  public content!: string

  @Column({ type: "uuid", name: "parent_reply_id", nullable: true })
  @AutoMap()
  public parentReplyId?: string | null

  @ManyToOne(() => Reply, { onDelete: "CASCADE" })
  @JoinColumn({ name: "parent_reply_id" })
  @AutoMap()
  public parent?: Reply | null

  @OneToMany(() => Reply, reply => reply.parent)
  public children?: Reply[]

  @DeleteDateColumn({ name: "deleted_at", nullable: true })
  @AutoMap()
  public deletedAt?: Date | null
}
