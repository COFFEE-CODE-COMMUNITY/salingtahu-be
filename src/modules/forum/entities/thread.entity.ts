import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm'
import { Reply } from './reply.entity'
import { ForumRating } from './forum-rating.entity'
import { BaseEntity } from "../../../common/base/base.entity"

@Entity('threads')
export class Thread extends BaseEntity {
  @Column({ type: 'uuid', name: 'user_id', nullable: false })
  userId!: string

  @Column('text')
  title!: string

  @Column('text')
  content!: string

  @Column({ type: 'text', nullable: true })
  category!: string | null

  @Column({ name: 'replies_count', type: 'int', default: 0 })
  repliesCount!: number

  @OneToMany(() => Reply, reply => reply.thread)
  replies!: Reply[]

  @OneToMany(() => ForumRating, rating => rating.thread)
  ratings!: ForumRating[]
}
