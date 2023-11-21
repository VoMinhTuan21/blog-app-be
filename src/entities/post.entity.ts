import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abstract.entity';
import Category from './category.entity';
import User from './user.entity';
import Comment from './comment.entity';
import Image from './image.entity';

@Entity()
export class Post extends AbstractEntity {
    @Column({ type: 'varchar', length: 100, nullable: false })
    title: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    thumbnail: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    mainDescription: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @ManyToOne(() => Category, (category) => category.posts)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];

    @OneToMany(() => Image, (image) => image.post)
    images: Image[];
}

export default Post;
