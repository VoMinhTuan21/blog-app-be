import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../vendors/base/abstract.entity';
import Account from './account.entity';
import Post from './post.entity';
import Comment from './comment.entity';

@Entity()
class User extends AbstractEntity {
    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    avatar: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    password: string;

    @OneToMany(() => Account, (account) => account.user)
    accounts: Account[];

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];
}

export default User;
