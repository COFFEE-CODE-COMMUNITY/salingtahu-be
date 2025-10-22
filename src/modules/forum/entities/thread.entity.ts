import { Entity, Column, OneToMany } from "typeorm"
import { Reply } from "./reply.entity"
import { ForumRating } from "./forum-rating.entity"
import { BaseEntity } from "../../../common/base/base.entity"

@Entity("threads")
export class Thread extends BaseEntity {
  @Column({ type: "uuid", name: "user_id", nullable: false })
  public userId!: string

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

  @OneToMany(() => ForumRating, rating => rating.thread)
  public ratings!: ForumRating[]
}
