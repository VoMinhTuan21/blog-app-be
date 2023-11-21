import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abstract.entity';
import Post from './post.entity';

@Entity()
export class Image extends AbstractEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    key: string;

    @ManyToOne(() => Post, (post) => post.images)
    @JoinColumn({ name: 'post_id' })
    post: Post;
}

export default Image;
