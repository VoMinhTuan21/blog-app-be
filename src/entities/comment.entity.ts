import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abstract.entity';
import Post from './post.entity';
import User from './user.entity';

@Entity()
export class Comment extends AbstractEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    description: string;

    @ManyToOne(() => User, (user) => user.comments)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Post, (post) => post.comments)
    @JoinColumn({ name: 'post_id' })
    post: Post;
}

export default Comment;
