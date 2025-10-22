import { Entity, Column, ManyToOne, Unique } from "typeorm"
import { Thread } from "./thread.entity"
import { Reply } from "./reply.entity"
import { BaseEntity } from "../../../common/base/base.entity"

@Entity("forums_ratings")
@Unique(["userId", "thread", "reply"])
export class ForumRating extends BaseEntity {
  @Column({ type: "uuid", name: "user_id", nullable: false })
  public userId!: string

  @ManyToOne(() => Thread, thread => thread.ratings, {
    nullable: true,
    onDelete: "CASCADE",
  })
  public thread!: Thread | null

  @ManyToOne(() => Reply, reply => reply.ratings, {
    nullable: true,
    onDelete: "CASCADE",
  })
  public reply!: Reply | null

  @Column({ type: "smallint" })
  public rating!: number
}
