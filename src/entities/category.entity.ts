import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abstract.entity';
import Post from './post.entity';

@Entity()
class Category extends AbstractEntity {
    @Column({ type: 'varchar', length: 100, nullable: false })
    title: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    image: string;

    @OneToMany(() => Post, (post) => post.category)
    posts: Post[];
}

export default Category;
