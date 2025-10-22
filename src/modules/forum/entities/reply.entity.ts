import { Entity, Column, ManyToOne, JoinColumn, DeleteDateColumn } from "typeorm"
import { Thread } from "./thread.entity"
import { User } from "../../user/entities/user.entity"
import { BaseEntity } from "../../../common/base/base.entity"

@Entity("replies")
export class Reply extends BaseEntity {
  @Column({ type: "uuid", name: "thread_id", nullable: false })
  public threadId!: string

  @ManyToOne(() => Thread, { onDelete: "CASCADE" })
  @JoinColumn({ name: "thread_id" })
  public thread!: Thread

  @Column({ type: "uuid", name: "user_id", nullable: false })
  public userId!: string

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  @JoinColumn({ name: "user_id" })
  public user?: User | null

  @Column("text")
  public content!: string

  @Column({ type: "uuid", name: "parent_reply_id", nullable: true })
  public parentReplyId?: string | null

  @ManyToOne(() => Reply, { onDelete: "CASCADE" })
  @JoinColumn({ name: "parent_reply_id" })
  public parent?: Reply | null

  @DeleteDateColumn({ name: "deleted_at", nullable: true })
  public deletedAt?: Date | null
}
