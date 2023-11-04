import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import User from './user.entity';

@Entity()
class Account {
    @Column({ primary: true })
    socialId: string;

    @Column({ primary: true })
    type: string;

    @Column({ nullable: true })
    email: string;

    @CreateDateColumn({ type: 'datetime', name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.accounts)
    @JoinColumn({ name: 'user_id' })
    user: User;
}

export default Account;
