import {
    BaseEntity,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ type: 'datetime', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
    updatedAt: Date;

    constructor() {
        super();
    }
}
