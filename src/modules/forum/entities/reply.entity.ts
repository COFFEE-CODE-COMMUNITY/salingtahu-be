import {
  Entity,
  Column,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { Thread } from './thread.entity'
import { ForumRating } from './forum-rating.entity'
import { BaseEntity } from "../../../common/base/base.entity"

@Entity('replies')
export class Reply extends BaseEntity {
  @ManyToOne(() => Thread, thread => thread.replies, { onDelete: 'CASCADE' })
  thread!: Thread

  @Column({ type: 'uuid', name: 'user_id', nullable: false })
  userId!: string

  @Column('text')
  content!: string

  @Column({ type: 'smallint', nullable: true })
  rating?: number

  @ManyToOne(() => Reply, reply => reply.children, { nullable: true, onDelete: 'CASCADE' })
  parent?: Reply

  @OneToMany(() => Reply, reply => reply.parent)
  children!: Reply[]

  @OneToMany(() => ForumRating, rating => rating.reply)
  ratings!: ForumRating[]

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date
}
