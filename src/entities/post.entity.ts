import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abstract.entity';
import Category from './category.entity';
import User from './user.entity';
import Comment from './comment.entity';

@Entity()
export class Post extends AbstractEntity {
    @Column({ type: 'varchar', length: 100, nullable: false })
    title: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    description: string;

    @ManyToOne(() => Category, (category) => category.posts)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];
}

export default Post;
